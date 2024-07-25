import { productProjectionsWithReviews } from "./src/ProductReviews";

export const handler = async (event: any, context: any) => {
  try {

    // Customers query will be changed to get reviews query from Deniz
    let productsWithReviews = await productProjectionsWithReviews(10);
    console.log("Products with Reviews:", productsWithReviews);

    if (!productsWithReviews) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No reviews found.' }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(productsWithReviews),
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error.' }),
    };
  }
};