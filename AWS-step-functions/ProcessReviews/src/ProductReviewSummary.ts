import { CustomObjectDraft, Product } from "@commercetools/platform-sdk";
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
    productID: string,
    summaryOfReview: any,
    isConfirmed: boolean,
    totalReviewCount: number,
    lastAveragePoint: number
): Promise<any> => {
    const valueObject = {
        productId: productID,
        isConfirmed: isConfirmed,
        summaryOfReview: generateSummaryModel(summaryOfReview),
        totalReviewCount: totalReviewCount,
        lastAveragePoint: lastAveragePoint
    };
    console.log("valueObject",JSON.stringify(valueObject))
    const variables = {
        draft: {
            container: reviewSummaryAttribute,
            key: productID,
            value: JSON.stringify(valueObject)
        }
    };
    return await executeGqlQuery(CreateOrUpdateCustomObject, variables);
};

function generateSummaryModel(summaryOfReview: string) {
    var parsedSummary = JSON.parse(summaryOfReview);
    return {
        summary: {
            tr: parsedSummary.summary.tr || null,
            en: parsedSummary.summary.en || null,
            fr: parsedSummary.summary.fr || null,
            de: parsedSummary.summary.de || null,
            nl: parsedSummary.summary.nl || null
        },
        commonPositive: {
            tr: parsedSummary.commonPositive.tr || null,
            en: parsedSummary.commonPositive.en || null,
            fr: parsedSummary.commonPositive.fr || null,
            de: parsedSummary.commonPositive.de || null,
            nl: parsedSummary.commonPositive.nl || null
        },
        commonNegative: {
            tr: parsedSummary.commonNegative.tr || null,
            en: parsedSummary.commonNegative.en || null,
            fr: parsedSummary.commonNegative.fr || null,
            de: parsedSummary.commonNegative.de || null,
            nl: parsedSummary.commonNegative.nl || null
        },
        noteableObservation: {
            tr: parsedSummary.noteableObservation.tr || null,
            en: parsedSummary.noteableObservation.en || null,
            fr: parsedSummary.noteableObservation.fr || null,
            de: parsedSummary.noteableObservation.de || null,
            nl: parsedSummary.noteableObservation.nl || null
        }
    };
};