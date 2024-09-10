import { productProjectionsWithReviews } from "./src/ProductReviews";

export const handler = async (event: any, context: any) => {
  const reviewCountDifference = 10;
  const pageSizeKB=256;
  try {
    let productsWithReviews = await productProjectionsWithReviews(reviewCountDifference, pageSizeKB);
    console.log("Products with Reviews:", productsWithReviews);

    if (!productsWithReviews) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No reviews found.' }),
      };
    }
    return {
      statusCode: 200,
      body: productsWithReviews,
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error.' }),
    };
  }
};