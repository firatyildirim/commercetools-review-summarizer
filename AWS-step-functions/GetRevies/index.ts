import fetch from "node-fetch";
import {
  ClientBuilder,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
} from "@commercetools/sdk-client-v2";
import {
  ApiRoot,
  ByProjectKeyRequestBuilder,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";

const projectKey = "ct-ai-exp";
const scopes = ["manage_project:ct-ai-exp"];

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: "https://auth.europe-west1.gcp.commercetools.com",
  projectKey: projectKey,
  credentials: {
    clientId: "3ROpu7YI28dltAii3qD9Dk5L",
    clientSecret: "W4FclkO_lHn_LMOxuXo-dx7Beh0ZgW3n",
  },
  scopes,
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: "https://api.europe-west1.gcp.commercetools.com",
  fetch,
};

// Export the ClientBuilder
const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: projectKey,
});

// I need to get today's date and yesterday's date
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const getReviewsAllRecentReviews = (
  startDate: string,
  endDate: string,
  productId: string
) => {
  return apiRoot
    .reviews()
    .get({
      queryArgs: {
        where: `lastModifiedAt >= "${startDate}" and lastModifiedAt < "${endDate}" and target(typeId = "product" and id = "${productId}")`,
      },
    })
    .execute();
};

const getReviews = (
  startDate: string,
  endDate: string,
  limit: number,
  offset?: number,
  sort?: string
) => {
  return apiRoot
    .reviews()
    .get({
      queryArgs: {
        where: `lastModifiedAt >= "${startDate}" and lastModifiedAt < "${endDate}"`,
        limit,
        offset,
        sort,
      },
    })
    .execute();
};

function getUniqueProductIds(reviewsMap: any[]) {
  const productIds = reviewsMap.map((review) => review.productId);
  const uniqueProductIds = [...new Set(productIds)];
  return uniqueProductIds;
}

var filteredReviews = [];

export const handler = async (event: any, context: any) => {
  try {
    console.log("Today:", today.toString());
    console.log("Yesterday:", yesterday.toString());
    // Customers query will be changed to get reviews query from Deniz
    // const customers = await getCustomers(apiRoot);

    const reviews = await getReviews(
      "2024-06-25T00:00:00.000Z",
      "2024-06-28T00:00:00.000Z",
      500
    )
      .then((reviews) => {
        const reviewsMap = reviews.body.results.map((review: any) => {
          return {
            id: review.id,
            title: review.title,
            text: review.text,
            rating: review.rating,
            productId: review.target.id,
            createdAt: review.createdAt,
            lastModifiedAt: review.lastModifiedAt,
          };
        });

        filteredReviews = getUniqueProductIds(reviewsMap);
        console.log("Recently reviewed products:", filteredReviews);

        return {
          reviews: reviewsMap,
          recentlyReviewedProducts: filteredReviews,
        };
      })
      .catch(console.error);

    console.log(reviews);
    return {
      statusCode: 200,
      body: JSON.stringify(reviews),
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
