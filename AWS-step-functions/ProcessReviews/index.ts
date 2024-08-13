import { APIGatewayProxyHandler } from "aws-lambda";
import { sendReviewsToGPT } from "./src/OpenAI";
import { createOrUpdateProductReviewSummaryObject } from "./src/ProductReviewSummary";

export const handler: APIGatewayProxyHandler = async (event, context) => {
  if (!event || !event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid input" }),
    };
  }

  try {
    
    var eventBody = getEventBody(event);
    var reviews = eventBody.reviews;
    var productId = eventBody.id;
    var totalReviewCount = calculateTotalReviewCount(reviews);
    var averageScore = calculateAverageScore(reviews);

    if (!reviews) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Reviews are missing" }),
      };
    }
   
    var gptResponse = await sendReviewsToGPT(reviews);
    if (gptResponse) {
    await createOrUpdateProductReviewSummaryObject(productId, gptResponse, false,totalReviewCount,averageScore);
      return {
        statusCode: 200,
        body: JSON.stringify(gptResponse),
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

const calculateTotalReviewCount = (reviews: any[]): number => {
  return reviews.length;
};

const calculateAverageScore = (reviews: { title: string; review: string; score: number }[]): number => {
  const totalScore = reviews.reduce((sum, review) => sum + review.score, 0);
  const averageScore = totalScore / reviews.length;
  return parseFloat(averageScore.toFixed(2)); // Rounded to 2 decimal places
};

const getEventBody = (event:any)=>{
  var eventBody = JSON.parse(event.body);
  return eventBody[0];
};
