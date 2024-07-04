import { gql } from '@apollo/client/core';

export const ProductProjectionSearch = gql`
query ProductProjectionSearch($limit: Int, $offset: Int, $filters: [SearchFilterInput!], $includeNames: [String!]) {
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
}`;

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
}`;

// With where condition we can fetch the reviews of the product. product id must be set.
// ReviewsInput = {
//   "sort": null,
//   "limit": null,
//   "offset": null,
//   "where": "target(typeId=\"product\" and id=\"product-id\")"
// }