import { gql } from '@apollo/client/core';

export const CreateOrUpdateCustomObject = gql`
mutation CreateOrUpdateCustomObject($draft: CustomObjectDraft!) {
  createOrUpdateCustomObject(draft: $draft) {
    version
    id
    lastModifiedAt
    container
    value
  }
}`;

// key should be set as product id
// productId in the value object should be set as product id
// Version is not required but if you include it, when creating the object version should be zero, for updating the object version must be set
// CreateOrUpdateCustomObjectInput = {
//   "draft": {
//     "container": "product-review-summary",
//     "key": "product-id",
//     "value": "{ \"productId\": \"string\", \"summaryOfReview\": [ { \"locale\": \"\", \"value\": \"\" } ], \"isConfirmed\": true, \"totalReviewCount\": 0, \"lastAvaragePoint\": 0 }",
//   }
// }