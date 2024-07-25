import { CustomObjectDraft, Product } from "@commercetools/platform-sdk";
import { apiRoot } from "./BuildClient";
import { CreateOrUpdateCustomObject } from "./GraphqlQueries";

const reviewSummaryAttribute = "product-review-summary";

const executeGqlQuery = async (query: any, variables: any) => {
    return apiRoot.graphql().post({
        body: {
            query: query.loc!.source.body.toString(),
            variables
        }
    }).execute();
}

// TODO: Refactor to update/create product-review-summary object
export const createOrUpdateProductReviewSummaryObject = async (product:Product, summary:any): Promise<any> => {
    const variables = {
          draft: {
            "container": "product-review-summary",
            "key": "product-id",
            "value": "{ \"productId\": \"string\", \"summaryOfReview\": [ { \"locale\": \"\", \"value\": \"\" } ], \"isConfirmed\": true, \"totalReviewCount\": 0, \"lastAvaragePoint\": 0 }",
          }
        }

    return await executeGqlQuery(CreateOrUpdateCustomObject, variables);
}