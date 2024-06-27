"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const sdk_client_v2_1 = require("@commercetools/sdk-client-v2");
const platform_sdk_1 = require("@commercetools/platform-sdk");
const projectKey = "ct-ai-exp";
const scopes = ["manage_project:ct-ai-exp"];
// Configure authMiddlewareOptions
const authMiddlewareOptions = {
    host: "https://auth.europe-west1.gcp.commercetools.com",
    projectKey: projectKey,
    credentials: {
        clientId: "3ROpu7YI28dltAii3qD9Dk5L",
        clientSecret: "W4FclkO_lHn_LMOxuXo-dx7Beh0ZgW3n",
    },
    scopes,
    fetch: node_fetch_1.default,
};
// Configure httpMiddlewareOptions
const httpMiddlewareOptions = {
    host: "https://api.europe-west1.gcp.commercetools.com",
    fetch: node_fetch_1.default,
};
// Export the ClientBuilder
const ctpClient = new sdk_client_v2_1.ClientBuilder()
    .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware() // Include middleware for logging
    .build();
const apiRoot = (0, platform_sdk_1.createApiBuilderFromCtpClient)(ctpClient).withProjectKey({
    projectKey: projectKey,
});
// I need to get today's date and yesterday's date
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const getReviewsAllRecentReviews = (startDate, endDate, productId) => {
    return apiRoot
        .reviews()
        .get({
        queryArgs: {
            where: `lastModifiedAt >= "${startDate}" and lastModifiedAt < "${endDate}" and target(typeId = "product" and id = "${productId}")`,
        },
    })
        .execute();
};
const getReviews = (startDate, endDate, limit, offset, sort) => {
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
function getUniqueProductIds(reviewsMap) {
    const productIds = reviewsMap.map((review) => review.productId);
    const uniqueProductIds = [...new Set(productIds)];
    return uniqueProductIds;
}
var filteredReviews = [];
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Today:", today.toString());
        console.log("Yesterday:", yesterday.toString());
        // Customers query will be changed to get reviews query from Deniz
        // const customers = await getCustomers(apiRoot);
        const reviews = yield getReviews("2024-06-25T00:00:00.000Z", "2024-06-28T00:00:00.000Z", 500)
            .then((reviews) => {
            const reviewsMap = reviews.body.results.map((review) => {
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
    }
    catch (error) {
        console.error("Error fetching reviews:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error." }),
        };
    }
});
exports.handler = handler;
