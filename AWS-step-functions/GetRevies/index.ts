import { ProductProjectionsSearchPaginationGql, MapProductsWithReviews } from "./src/ProductReviews";

export const handler = async (event: any, context: any) => {
  try {

    // Step 1 - Search all products with reviewRatingStatistics.count > 0 and has "product-review-summary" attribute if none of them has this attribute return all product ids with reviewRatings.count > 0
    var allProducts = await ProductProjectionsSearchPaginationGql(10);

    // Step 2 - Fetch and map product reviews 
    let productsWithReviews = await MapProductsWithReviews(allProducts!, ["lastModifiedAt desc"]);

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

