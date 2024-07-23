import { APIGatewayProxyHandler } from "aws-lambda";
import axios from "axios";
import OpenAI from "openai";

import { MapProductsWithReviews } from "./src/ProductReviews";

const chatGptApiKey = "YOUR_CHATGPT_API_KEY";
const chatGptApiUrl = "https://api.openai.com/v1/completions";

const openai = new OpenAI();
//GPT MODELS
const GPT_3_5_TURBO = "gpt-3.5-turbo";
const GPT_4o = "gpt-4o";
const GPT_4_TURBO = "gpt-4-turbo";
const GPT_4o_MINI = "gpt-4o-mini";
//GPT ROLES
const USER = "user";

const ASSISTANT = "assistant";

const SYSTEM = "system";

export const handler = async (event: any, context: any) => {
  // const reviews = JSON.parse(event.body);

  if (event == null) return;
  const eventBody = JSON.parse(event.body);
  const reviews = JSON.stringify(eventBody);
  if (reviews == null) {
    return;
  }

  try {
    // var allProducts = await ProductProjectionsSearchPaginationGql(10);
    // let productsWithReviews = await MapProductsWithReviews(allProducts!, [
    //   "lastModifiedAt desc",
    // ]);

    var response = await openai.chat.completions.create({
      model: GPT_3_5_TURBO,
      max_tokens: 150, //to be calculated and determined
      temperature: 1, // Use the appropriate model
      messages: [
        {
          role: USER,
          content: reviews,
        },
        { role: SYSTEM, content: SYSTEM_CONTENT2 },
      ],
    });

    console.log("GPT API response:", response);
    return response;
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
function ProductProjectionsSearchPaginationGql(arg0: number) {
  throw new Error("Function not implemented.");
}

const SYSTEM_CONTENT2 = `You are a bot designed to process and summarize product reviews given in the form of a JSON object in a string. Given the JSON object below, you must analyze the comments to create a brief summary.

Example JSON Object:

[
  {
	"score": 4,
	"date": "12-04-2024",
	"comment": "Ömürlük bir ürün. İnanılmaz süreler sıcak ve soğuk tutuyor. Her sene farklı markalardan işe yaramayan termos almaktansa tek seferde buna para verin :)",
	"locale": "tr-TR"
  }
]

Summarize these comments into three categories: “common positive comment”, “common negative comments”, “notable observation”. The summaries shouldn't exceed 3 sentences.

Translate the generated summaries to these languages [tr-TR, en-US, fr-FR, de-DE, nl-NL].

Do not take any discriminative, rude and bad comments to summary as a parameter.

The output must be a JSON object as shown below, with "average-score" as a floating number with two decimal points and all other values as strings:

{
	"average-score": double .2f,
	"summary": "string",
	"common-positive": {
		"tr-TR": "string",
		"en-US": "string",
		"fr-FR": "string",
		"de-DE": "string",
		"nl-NL": "string"
	},
	"common-negative": {
		"tr-TR": "string",
		"en-US": "string",
		"fr-FR": "string",
		"de-DE": "string",
		"nl-NL": "string"
	},
	"noteable-observation": {
		"tr-TR": "string",
		"en-US": "string",
		"fr-FR": "string",
		"de-DE": "string",
		"nl-NL": "string"
	}
}

Remember, the output must be a valid JSON object like stated above.`;
