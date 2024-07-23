import { gql } from "@apollo/client/core";

export const GetProductTypes = gql`
  query ProductTypes($limit: Int, $offset: Int, $where: String) {
    productTypes(limit: $limit, offset: $offset, where: $where) {
      offset
      count
      total
      results {
        id
        version
        name
        description
        key
        attributeDefinitions {
          results {
            name
            labelAllLocales {
              locale
              value
            }
            inputTipAllLocales {
              locale
              value
            }
            type {
              ... on ReferenceAttributeDefinitionType {
                name
                referenceTypeId
              }
            }
            attributeConstraint
            isRequired
            isSearchable
            inputHint
          }
        }
      }
    }
  }
`;

// Where can be set null. To filter by name we can use the following pattern.
// to filter by key or id, set where condition as: "key=\"bedding-bundle\"" or "where": "id=\"8ca39dff-987c-42c8-80ba-4398dc2de3ae\"", "name=\"Bedding Bundle\""
// export const GetProductTypesQueryVariables = {
//   "limit": null,
//   "offset": null,
//   "where": null
// }

export const UpdateProductType = gql`
  mutation UpdateProductType(
    $version: Long!
    $actions: [ProductTypeUpdateAction!]!
    $updateProductTypeId: String
    $key: String
  ) {
    updateProductType(
      version: $version
      actions: $actions
      id: $updateProductTypeId
      key: $key
    ) {
      version
      id
      key
      name
      attributeDefinitions {
        total
        results {
          type {
            name
            ... on ReferenceAttributeDefinitionType {
              name
              referenceTypeId
            }
          }
          name
          labelAllLocales {
            locale
            value
          }
          inputTipAllLocales {
            locale
            value
          }
          isRequired
          isSearchable
          attributeConstraint
          inputHint
        }
      }
    }
  }
`;

// product type Id or key must be provided in "updateProductTypeId" or "key" fields
// product type version must be set
// UpdateProductTypeInput = {
//   "updateProductTypeId": null,
//   "key": null,
//   "version": 1,
//   "actions": [
//     {
//       "addAttributeDefinition": {
//         "attributeDefinition": {
//           "type": {
//             "reference": {
//               "referenceTypeId": "key-value-document"
//             }
//           },
//           "name": "product-review-summary",
//           "label": [
//             {
//               "locale": "en",
//               "value": "Product Review Summary"
//             }
//           ],
//           "inputTip": [
//             {
//               "locale": "en",
//               "value": "Product review summary generated by ai"
//             }
//           ],
//           "isRequired": false,
//           "isSearchable": true,
//           "attributeConstraint": "SameForAll",
//           "inputHint": "MultiLine"
//         }
//       }
//     }
//   ],
// }

export const CreateOrUpdateCustomObject = gql`
  mutation CreateOrUpdateCustomObject($draft: CustomObjectDraft!) {
    createOrUpdateCustomObject(draft: $draft) {
      version
      id
      lastModifiedAt
      container
      value
    }
  }
`;

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

export const ProductProjectionSearch = gql`
  query ProductProjectionSearch(
    $limit: Int
    $offset: Int
    $filters: [SearchFilterInput!]
    $includeNames: [String!]
  ) {
    productProjectionSearch(limit: $limit, offset: $offset, filters: $filters) {
      offset
      count
      total
      results {
        id
        masterVariant {
          attributesRaw(includeNames: $includeNames) {
            name
            value
            referencedResource {
              ... on CustomObject {
                id
                version
                lastModifiedAt
                container
                key
                value
              }
            }
          }
        }
        reviewRatingStatistics {
          averageRating
          highestRating
          lowestRating
          count
          ratingsDistribution
        }
      }
    }
  }
`;

// filters field value can be null. By this filter we can fetch products which have reviewRatingStatistics count range between 1 to *
// ProductProjectionSearchInput = {
//   "limit": null,
//   "offset": null,
//   "filters": [
//     {
//       "model": {
//         "range": {
//           "path": "reviewRatingStatistics.count",
//           "ranges": [
//             {
//               "from": "1",
//               "to": "*"
//             }
//           ],
//         }
//       }
//     }
//   ],
//   includeNames: "product-review-summary"
// }

export const Reviews = gql`
  query Reviews($sort: [String!], $limit: Int, $offset: Int, $where: String) {
    reviews(sort: $sort, limit: $limit, offset: $offset, where: $where) {
      offset
      count
      total
      results {
        id
        version
        lastModifiedAt
        includedInStatistics
        authorName
        title
        text
        rating
        target {
          ... on Product {
            id
          }
        }
        targetRef {
          id
          typeId
        }
      }
    }
  }
`;

// With where condition we can fetch the reviews of the product. product id must be set.
// ReviewsInput = {
//   "sort": null,
//   "limit": null,
//   "offset": null,
//   "where": "target(typeId=\"product\" and id=\"product-id\")"
// }