import fetch from "node-fetch";
import "dotenv/config";
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

const projectKey = process.env.CTP_PROJECT_KEY!;
const scopes = [process.env.CTP_SCOPE!];

const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: process.env.CTP_AUTH_URL!,
  projectKey: projectKey,
  credentials: {
    clientId: process.env.CTP_CLIENT_ID!,
    clientSecret: process.env.CTP_CLIENT_SECRET!,
  },
  scopes,
  fetch,
};

const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: process.env.CTP_API_URL!,
  fetch,
};

const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey)
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();

const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: projectKey,
});

function getFormattedTodayDate(): string {
  const today = new Date();

  today.setUTCHours(0, 0, 0, 0);

  return today.toISOString();
}

function getFormattedYesterdayDate(): string {
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  yesterday.setUTCHours(0, 0, 0, 0);

  return yesterday.toISOString();
}

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
    const reviews = await getReviews(
      getFormattedYesterdayDate(),
      getFormattedTodayDate(),
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
