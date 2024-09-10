import { sendReviewsToGPT } from "./src/OpenAI";
import { createOrUpdateProductReviewSummaryObject } from "./src/ProductReviewSummary";
import "dotenv/config";

export const handler = async (event: any, context: any) => {

  if (!event) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Invalid input"
          + "Event:" + JSON.stringify(event)
          + "Context:" + JSON.stringify(context)
      }),
    };
  }

  try {
    const reviews = event.reviews;
    var totalReviewCount = calculateTotalReviewCount(reviews);
    var averageScore = calculateAverageScore(reviews);

    if (!reviews) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Reviews are missing" }),
      };
    }

    var gptResponse = await sendReviewsToGPT(reviews);
    console.log("gptResponse", gptResponse);
    if (!gptResponse) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "No content in Chat-GPT response." + gptResponse }),
      };
    }

    const product = {
      id: event.id,
      version: event.version,
      reviewRatingStatistics: event.reviewRatingStatistics
    };

    const updateProductReviewSummaryResponse = await createOrUpdateProductReviewSummaryObject(product, gptResponse, false, totalReviewCount, averageScore);
    console.log("updateProductReviewSummaryResponse", updateProductReviewSummaryResponse);
    if (!updateProductReviewSummaryResponse || updateProductReviewSummaryResponse.statusCode !== 200) {
      return {
        statusCode: updateProductReviewSummaryResponse.statusCode,
        body: JSON.stringify(updateProductReviewSummaryResponse.body.errors)
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(updateProductReviewSummaryResponse),
    };

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