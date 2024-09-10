import { Product, Review } from "@commercetools/platform-sdk";
import { apiRoot } from "./BuildClient";
import { ProductProjectionSearch, Reviews } from "./GraphqlQueries";

const reviewSummaryAttribute = "product-review-summary";

const executeGqlQuery = async (query: any, variables: any) => {
    return apiRoot.graphql().post({
        body: {
            query: query.loc!.source.body.toString(),
            variables
        }
    }).execute();
}

const productProjectionsSearchGql = async (limit = 500, offset = 0): Promise<any> => {
    const variables = {
        limit,
        offset,
        filters: [{
            model: {
                range: {
                    path: "reviewRatingStatistics.count",
                    ranges: [{ from: "1", to: "*" }],
                }
            }
        }],
        includeNames: reviewSummaryAttribute
    };

    return await executeGqlQuery(ProductProjectionSearch, variables);
}

const parseFloatToFixedTwo = (number: number): any => {
    return parseFloat(number.toFixed(2));
}

const productProjectionsWithReviewCriteria = (products: Product[], reviewCountDifference: number): Product[] => {
    // Filter products with the "product-review-summary" attribute and matching criteria
    let filteredProducts = products.filter((product: any) => {
        const hasReviewSummary = product.masterVariant.attributesRaw.some(
            (att: any) => att.name === reviewSummaryAttribute
        );

        if (hasReviewSummary) {
            const productReviewSummary = product.masterVariant.attributesRaw.find(
                (att: any) => att.name === reviewSummaryAttribute
            );

            return (
                product.reviewRatingStatistics.count > productReviewSummary.referencedResource.value.totalReviewCount + reviewCountDifference ||
                parseFloatToFixedTwo(product.reviewRatingStatistics.averageRating) !== parseFloatToFixedTwo(productReviewSummary.referencedResource.value.lastAveragePoint)
            );
        }

        return product;
    });

    // If no products with "product-review-summary" attribute, include all products
    if (filteredProducts.length === 0) {
        filteredProducts = products;
    }
    return filteredProducts;
}

const mapProducts = (products: Product[]): any[] => {
    return products.map(product => ({ id: product.id, version:product.version, reviewRatingStatistics : product.reviewRatingStatistics }))
}

const fetchProductProjectionsSearchPaginationGql = async (reviewCountDifference: number, limit = 500): Promise<any[]> => {
    let offset = 0;
    let allProducts: any[] = [];
    let hasMore = true;

    while (hasMore) {
        const response = await productProjectionsSearchGql(limit, offset);
        const results: Product[] = response.body.data.productProjectionSearch.results;

        let filteredProducts = productProjectionsWithReviewCriteria(results, reviewCountDifference);

        let products = mapProducts(filteredProducts);
        allProducts = [...allProducts, ...products];

        hasMore = results.length === limit;
        offset += limit;
    }

    return allProducts;
}

const formatProductIdsForGql = (products: Product[]): string => {
    return products.map(product => `\"${product.id}\"`).join(', ');
}

const fetchProductReviewsGql = async (products: Product[], sort: string[] = [], limit = 500, offset = 0): Promise<any> => {
    const variables = {
        sort,
        limit,
        offset,
        where: products.length > 0 ? `target(typeId="product" and id in (${formatProductIdsForGql(products)}))` : 'target(typeId="product")'
    };

    return await executeGqlQuery(Reviews, variables);
}

const mapReviews = (reviews: Review[]): any[] => {
    return reviews.map(review => ({
        title: review.title,
        review: review.text,
        score: review.rating
    }));
}

const fetchProductReviewsPaginationGql = async (products: Product[], sort: string[] = []): Promise<any[]> => {
    const limit = 500;
    let allReviews: any[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
        const reviewResponse = await fetchProductReviewsGql(products, sort, limit, offset);
        const results: Review[] = reviewResponse.body.data.reviews.results;

        allReviews = [...allReviews, ...results];
        hasMore = results.length === limit;
        offset += limit;
    }

    return allReviews;
}

const estimateSizeInKB = <T>(param: T): number => {
    const jsonString = JSON.stringify(param);
    const bytes = new TextEncoder().encode(jsonString).length;
    return bytes / 1024;
}

const paginateBasedOnSize = (data: any[], pageSize: number): any[] => {
    let result = [];
    let currentPage:any = [];

    data.forEach((item,i) => {
        currentPage.push(item);
        if (estimateSizeInKB(currentPage) > pageSize) {
            currentPage.pop();
            result.push(currentPage);
            currentPage = [item];
        }
    });

    if (currentPage.length) 
        result.push(currentPage);
    return result;
}

export const productProjectionsWithReviews = async (reviewCountDifference: number, pageSize: number): Promise<any[]> => {
    const allProducts = await fetchProductProjectionsSearchPaginationGql(reviewCountDifference);
    const allReviews = await fetchProductReviewsPaginationGql(allProducts);

    let productsWithReviews = allProducts.map(product => ({
        ...product,
        reviews: mapReviews(allReviews
            .filter(review => review.target.id === product.id))
    }));

    const sizeInKB = estimateSizeInKB(productsWithReviews);
    if (sizeInKB > pageSize) {
        productsWithReviews = paginateBasedOnSize(productsWithReviews, pageSize);
    }

    return productsWithReviews;
}
