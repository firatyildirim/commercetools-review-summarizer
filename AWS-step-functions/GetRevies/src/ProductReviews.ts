import { apiRoot } from "./BuildClient"
import { ProductProjectionSearch, Reviews } from "./GraphqlQueries";

// Step 1 - Search all products

// Fetch products that have reviewRatingsStatistics count higher that 0, and include attribute named "product-review-summary".
const ProductProjectionsSearchGql = async (limit?: number, offset?: number) => {
    const ProductProjectionSearchInput = {
        limit,
        offset,
        filters: [
            {
                model: {
                    range: {
                        path: "reviewRatingStatistics.count",
                        ranges: [
                            {
                                from: "1",
                                to: "*"
                            }
                        ],
                    }
                }
            }
        ],
        includeNames: "product-review-summary"
    }

    return await apiRoot
        .graphql()
        .post({
            body: {
                query: ProductProjectionSearch.loc!.source.body.toString(),
                variables: ProductProjectionSearchInput
            }
        })
        .execute();
}

export const ProductProjectionsSearchPaginationGql = async (reviewCountDifference: number,) => {
    const limit = 500;
    let offset = 0;
    let allProducts: any[] = [];
    const reviewSummaryAttributeName = "product-review-summary";

    try {
        let hasMore = true;

        // Loop to handle pagination
        while (hasMore) {
            // Fetch a page of products with reviewRatingStatistics.count > 0
            const productSearch = await ProductProjectionsSearchGql(limit, offset);
            const results = productSearch.body.data.productProjectionSearch.results;

            // Filter products with the "product-review-summary" attribute and matching criteria
            let filteredProducts = results
                .filter((product: any) => {
                    const hasReviewSummary = product.masterVariant.attributesRaw.some(
                        (att: any) => att.name === reviewSummaryAttributeName
                    );

                    if (hasReviewSummary) {
                        const productReviewSummary = product.masterVariant.attributesRaw.find(
                            (att: any) => att.name === reviewSummaryAttributeName
                        );

                        return (
                            product.reviewRatingStatistics.count + reviewCountDifference > productReviewSummary.referencedResource.value.totalReviewCount ||
                            product.reviewRatingStatistics.averageRating !== productReviewSummary.referencedResource.value.lastAvaragePoint
                        );
                    }

                    return false;
                });

            // If no products with "product-review-summary" attribute, include all products
            if (filteredProducts.length === 0) {
                filteredProducts = results;
            }

            allProducts = [...allProducts, ...filteredProducts];

            console.log(`Page ${offset / limit + 1}:`, filteredProducts);

            // Check if there are more products to fetch
            hasMore = results.length === limit;
            offset += limit;
        }
        return allProducts;
    } catch (err) {
        console.log(err);
    }
}

// Step 2 - Fetch product reviews
const FetchProductReviewsGql = async (product: any, sort?: [String], limit?: number, offset?: number,) => {
    const ReviewsInput = {
        sort,
        limit,
        offset,
        where: `target(typeId="product" and id="${product.id}")`
    }

    return apiRoot
        .graphql()
        .post({
            body: {
                query: Reviews.loc!.source.body.toString(),
                variables: ReviewsInput
            }
        })
        .execute();
}

export const FetchProductReviewsPaginationGql = async (product: any, sort?: [string]) => {
    const limit = 500
    let offset = 0;
    let allReviews: any[] = [];
    let hasMore = true;

    try {
        while (hasMore) {
            const reviews = await FetchProductReviewsGql(product, sort, limit, offset);

            const results = reviews.body.data.reviews.results;
            allReviews = [...allReviews, ...results];

            console.log(`Page ${offset / limit + 1}:`, results);

            // Check if there are more reviews to fetch
            hasMore = results.length === limit;
            offset += limit;
        }

        return allReviews;
    } catch (err) {
        console.error(err);
    }
}

export const MapProductsWithReviews = async (products: any[], sort?:[string]) => {
    const productsWithReviews = products.map(async (product) => {
        const reviews = await FetchProductReviewsPaginationGql(product, sort);
        const productWithReviews: any = {
            productId: product.id,
            reviews
        };
        return productWithReviews;
    });

    return await Promise.all(productsWithReviews);
}