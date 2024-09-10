import { CustomObjectDraft, Product, ProductUpdateAction } from "@commercetools/platform-sdk";
import { apiRoot } from "./BuildClient";
import { CreateOrUpdateCustomObject } from "./GraphqlQueries";

const reviewSummaryAttribute = "product-review-summary";

const executeGqlQuery = async (query: any, variables: any) => {
    try {
        const response = await apiRoot.graphql().post({
            body: {
                query: query.loc!.source.body.toString(),
                variables
            },
            headers: {
                'Content-Type': 'application/json'
            }
        }).execute();

        return response;
    } catch (error) {
        // Handle and log the error
        console.error("Error executing GraphQL query:", error);
        throw error; // Optionally, re-throw the error if you want it to propagate
    }
};

export const createOrUpdateProductReviewSummaryObject = async (
    product: Product | any,
    summaryOfReview: any,
    isConfirmed: boolean,
    totalReviewCount: number,
    lastAveragePoint: number
): Promise<any> => {
    const valueObject = {
        productId: product.id,
        isConfirmed: isConfirmed,
        summaryOfReview: generateSummaryModel(summaryOfReview),
        totalReviewCount: totalReviewCount, // product.reviewRatingStatistics!.count,
        lastAveragePoint: lastAveragePoint  // product.reviewRatingStatistics!.averageRating
    };

    const variables = {
        draft: {
            container: reviewSummaryAttribute,
            key: product.id,
            value: JSON.stringify(valueObject)
        }
    };
    return await executeGqlQuery(CreateOrUpdateCustomObject, variables);
};

const generateSummaryModel = (summaryOfReview: any) => {
    summaryOfReview = JSON.parse(summaryOfReview);
    return {
        summary: {
            tr: summaryOfReview.summary.tr || null,
            en: summaryOfReview.summary.en || null,
            fr: summaryOfReview.summary.fr || null,
            de: summaryOfReview.summary.de || null,
            nl: summaryOfReview.summary.nl || null
        },
        commonPositive: {
            tr: summaryOfReview.commonPositive.tr || null,
            en: summaryOfReview.commonPositive.en || null,
            fr: summaryOfReview.commonPositive.fr || null,
            de: summaryOfReview.commonPositive.de || null,
            nl: summaryOfReview.commonPositive.nl || null
        },
        commonNegative: {
            tr: summaryOfReview.commonNegative.tr || null,
            en: summaryOfReview.commonNegative.en || null,
            fr: summaryOfReview.commonNegative.fr || null,
            de: summaryOfReview.commonNegative.de || null,
            nl: summaryOfReview.commonNegative.nl || null
        },
        noteableObservation: {
            tr: summaryOfReview.noteableObservation.tr || null,
            en: summaryOfReview.noteableObservation.en || null,
            fr: summaryOfReview.noteableObservation.fr || null,
            de: summaryOfReview.noteableObservation.de || null,
            nl: summaryOfReview.noteableObservation.nl || null
        }
    };
};

export const updateProductReviewSummaryAttribute = async (customObjectId:string, product:Product|any) => {
    const updateAction: ProductUpdateAction = {
        action: 'setAttributeInAllVariants',
        name: reviewSummaryAttribute,
        value:{
            typeId: "key-value-document",
            id: customObjectId
        }
    }

    return await apiRoot.products().withId({ID: product.id}).post({
        body: {
            version: product.version,
            actions: [updateAction]
        }
    }).execute();
}
