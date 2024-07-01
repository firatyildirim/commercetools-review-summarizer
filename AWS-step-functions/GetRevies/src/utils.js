"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupReviewsByProduct = exports.getFormattedYesterdayDate = exports.getFormattedTodayDate = void 0;
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
exports.groupReviewsByProduct = groupReviewsByProduct;
function getFormattedTodayDate() {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    today.setUTCHours(0, 0, 0, 0);
    return today.toISOString();
}
exports.getFormattedTodayDate = getFormattedTodayDate;
function getFormattedYesterdayDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 3);
    yesterday.setUTCHours(0, 0, 0, 0);
    return yesterday.toISOString();
}
exports.getFormattedYesterdayDate = getFormattedYesterdayDate;
