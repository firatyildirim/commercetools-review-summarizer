import { ProductProjectionsWithReviews } from "./src/ProductReviews";

export const handler = async (event: any, context: any) => {
  try {
    let productsWithReviews = await ProductProjectionsWithReviews(10);
    console.log("Products with Reviews:", productsWithReviews);

    if (!productsWithReviews) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No reviews found." }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(productsWithReviews[0]),
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
