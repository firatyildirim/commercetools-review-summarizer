import { APIGatewayProxyHandler } from "aws-lambda";
import OpenAI from "openai";


const key = process.env.OPENAI_API_KEY;
const openai = new OpenAI();
//GPT MODELS
const GPT_3_5_TURBO = "gpt-3.5-turbo";
const GPT_4o =  "gpt-4o";
const GPT_4_TURBO ="gpt-4-turbo";
const GPT_4o_MINI =  "gpt-4o-mini";
//GPT ROLES
const USER = "user";
/*
User Role:
What it does: This role represents the human user in the conversation. Inputs from the user guide the conversation and prompt responses from the assistant.

When to use it: Whenever the human user is making a statement or asking a question. This is the most frequent role used in a standard interaction.
*/
const ASSISTANT = "assistant";
/*
Assistant Role:
What it does: This is the role of the model itself, responding to user inputs based on the context set by the system.

When to use it: This role is automatically assumed by the model when it replies to the user’s queries or follows the system’s instructions. 
*/
const SYSTEM = "system"
/*System Role:
What it does: The System role is used to provide setup information or context that informs the behavior of the model. This can include instructions or guidelines on how the conversation should proceed.

When to use it: You use this role to set the stage for the interaction. For example, if you want the model to maintain a formal tone throughout the conversation or if you need to specify rules like avoiding certain topics.
*/

export const handler: APIGatewayProxyHandler = async (event: any) => {
  if(event == null) return;
  const reviews = JSON.parse(event.body);
  if(reviews == null) {
    return;
  }
  try {
    var results = await SendRequestToGPT(reviews);
    console.log(results);
    

  } catch (error : any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};


async function SendRequestToGPT(userContent: any) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: SYSTEM, content: SYSTEM_CONTENT },{ role: USER, content: userContent }],
    model: GPT_3_5_TURBO,
    max_tokens:100,//to be calculated and determined
    temperature:1//decimal value between 0.0 and 2.0. Determines the freedom of the GPT when generating answers.
  });
  return completion.choices[0];
}

const SYSTEM_CONTENT = "You are a bot designed to process and summarize product reviews given in the form of a JSON object. Given the JSON object below, you must analyze the comments to create a brief summary." +
	"" +
	"Example JSON Object:" +
	"" +
	"[" +
	"  {" +
	"	\"score\": 4," +
	"	\"date\": \"12-04-2024\"," +
	"	\"comment\": \"Ömürlük bir ürün. İnanılmaz süreler sıcak ve soğuk tutuyor. Her sene farklı markalardan işe yaramayan termos almaktansa tek seferde buna para verin :)\"," +
	"	\"locale\": \"tr-TR\"" +
	"  }" +
	"]" +
	"" +
	"Summarize these comments into three categories: “common positive comment”, “common negative comments”, “notable observation”. The summaries shouldn't exceed 3 sentences." +
	"" +
	"Translate the generated summaries to these languages [tr-TR, en-US, fr-FR, de-DE, nl-NL]." +
	"" +
	"Do not take any discriminative, rude and bad comments to summary as a parameter." +
	"" +
	"The output must be a JSON object as shown below, with \"average-score\" as a floating number with two decimal points and all other values as strings:" +
	"" +
	"{" +
	"	\"average-score\": double .2f," +
	"	\"summary\": \"string\"," +
	"	\"common-positive\": {" +
	"		\"tr-TR\": \"string\"," +
	"		\"en-US\": \"string\"," +
	"		\"fr-FR\": \"string\"," +
	"		\"de-DE\": \"string\"," +
	"		\"nl-NL\": \"string\"" +
	"	}," +
	"	\"common-negative\": {" +
	"		\"tr-TR\": \"string\"," +
	"		\"en-US\": \"string\"," +
	"		\"fr-FR\": \"string\"," +
	"		\"de-DE\": \"string\"," +
	"		\"nl-NL\": \"string\"" +
	"	}," +
	"	\"noteable-observation\": {" +
	"		\"tr-TR\": \"string\"," +
	"		\"en-US\": \"string\"," +
	"		\"fr-FR\": \"string\"," +
	"		\"de-DE\": \"string\"," +
	"		\"nl-NL\": \"string\"" +
	"	}" +
	"}" +
	"" +
	"Remember, the output must be a valid JSON object.";