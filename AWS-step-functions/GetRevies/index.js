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
require("dotenv/config");
const sdk_client_v2_1 = require("@commercetools/sdk-client-v2");
const platform_sdk_1 = require("@commercetools/platform-sdk");
const projectKey = process.env.CTP_PROJECT_KEY;
const scopes = [process.env.CTP_SCOPE];
const authMiddlewareOptions = {
    host: process.env.CTP_AUTH_URL,
    projectKey: projectKey,
    credentials: {
        clientId: process.env.CTP_CLIENT_ID,
        clientSecret: process.env.CTP_CLIENT_SECRET,
    },
    scopes,
    fetch: node_fetch_1.default,
};
const httpMiddlewareOptions = {
    host: process.env.CTP_API_URL,
    fetch: node_fetch_1.default,
};
const ctpClient = new sdk_client_v2_1.ClientBuilder()
    .withProjectKey(projectKey)
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
const apiRoot = (0, platform_sdk_1.createApiBuilderFromCtpClient)(ctpClient).withProjectKey({
    projectKey: projectKey,
});
function getFormattedTodayDate() {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    today.setUTCHours(0, 0, 0, 0);
    return today.toISOString();
}
function getFormattedYesterdayDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 3);
    yesterday.setUTCHours(0, 0, 0, 0);
    return yesterday.toISOString();
}
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
function groupReviewsByProduct(reviewsMap) {
    const productReviews = {};
    reviewsMap.forEach((review) => {
        const { productId } = review;
        if (!productReviews[productId]) {
            productReviews[productId] = [];
        }
        productReviews[productId].push(review);
    });
    return productReviews;
}
var filteredReviews = [];
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield getReviews(getFormattedYesterdayDate(), getFormattedTodayDate(), 500)
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
            // I need a json object that contains the product reviews under the product id
            // return {
            //   reviews: reviewsMap,
            //   recentlyReviewedProducts: filteredReviews,
            // };
            const productReviewsMap = groupReviewsByProduct(reviewsMap);
            console.log("Product Reviews Map:", productReviewsMap);
            return productReviewsMap;
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
