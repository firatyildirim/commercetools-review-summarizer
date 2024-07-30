import { APIGatewayProxyHandler } from "aws-lambda";
import OpenAI from "openai";
import { createOrUpdateProductReviewSummaryObject } from "./src/ProductReviewSummary";

const openai = new OpenAI();

// GPT MODELS
const GPT_3_5_TURBO = "gpt-3.5-turbo";
const GPT_4o = "gpt-4o";
const GPT_4_TURBO = "gpt-4-turbo";
const GPT_4o_MINI = "gpt-4o-mini";

// GPT ROLES
const USER = "user";
const ASSISTANT = "assistant";
const SYSTEM = "system";

// SYSTEM CONTENT
const SYSTEM_CONTENT2 = `You are a bot designed to process and summarize product reviews given in the form of a JSON object in a string. Given the JSON object below, you must analyze the comments to create a brief summary.

Example JSON Object:

[
  {
    "title": "Not the best insulation",
    "review": "While it does keep my coffee warm, it doesn't stay hot as long as I expected.",
    "score": 3
  },
  {
    "title": "Nicht die beste Isolierung",
    "review": "Obwohl er meinen Kaffee warm hält, bleibt er nicht so lange heiß, wie ich erwartet habe.",
    "score": 3
  }
]

Summarize these comments into four categories: "summary", "common positive comment", "common negative comments", "notable observation". The summaries shouldn't exceed 3 sentences.

Translate the generated summaries to these languages [tr-TR, en-US, fr-FR, de-DE, nl-NL].

Do not take any discriminative, rude and bad comments to summary as a parameter.

The output must be a JSON object as shown below, with "average-score" as a floating number with two decimal points and all other values as strings. Do not stringify the JSON response. Do not add any spacing to JSON response:

{
  "average-score": double .2f,
  "summary": {
    "tr-TR": "string",
    "en-US": "string",
    "fr-FR": "string",
    "de-DE": "string",
    "nl-NL": "string"
  },
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

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!event || !event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid input" }),
    };
  }

  try {
    const eventBody = JSON.parse(event.body);
    const reviews = JSON.stringify(eventBody[0].reviews);

    if (!reviews) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Reviews are missing" }),
      };
    }

    const response = await openai.chat.completions.create({
      model: GPT_4o,
      temperature: 1,
      messages: [
        {
          role: USER,
          content: reviews,
        },
        {
          role: SYSTEM,
          content: SYSTEM_CONTENT2,
        },
      ],
    });

    const contentFromResponse = response.choices[0].message.content;
    if (contentFromResponse) {
		console.log("kaan",contentFromResponse);
      return {
        statusCode: 200,
        body: JSON.stringify(contentFromResponse),
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "No content in response" }),
      };
    }

  } catch (error: any) {
    console.error("Error processing request:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
