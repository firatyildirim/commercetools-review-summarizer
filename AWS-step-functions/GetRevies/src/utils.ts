interface ProductReviewsMap {
  [productId: string]: any[];
}

function groupReviewsByProduct(reviewsMap: any[]): ProductReviewsMap {
  const productReviews: ProductReviewsMap = {};

  reviewsMap.forEach((review) => {
    const { productId } = review;
    if (!productReviews[productId]) {
      productReviews[productId] = [];
    }
    productReviews[productId].push(review);
  });

  return productReviews;
}

function getFormattedTodayDate(): string {
  const today = new Date();

  today.setDate(today.getDate() + 2);

  today.setUTCHours(0, 0, 0, 0);

  return today.toISOString();
}

function getFormattedYesterdayDate(): string {
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 3);

  yesterday.setUTCHours(0, 0, 0, 0);

  return yesterday.toISOString();
}

export {
  ProductReviewsMap,
  getFormattedTodayDate,
  getFormattedYesterdayDate,
  groupReviewsByProduct,
};
