"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const gqlQueries_1 = require("./src/gqlQueries");
// export const handler = async (event: any, context: any) => {
//   try {
//     (async () => {
//       try {
//         await apiRoot
//           .graphql()
//           .post({
//             body: {
//               query: queryProjectSettings,
//               variables: {},
//             },
//           })
//           .execute()
//           .then((data: any) => {
//             console.log("Project information --->", data);
//           })
//           .catch((error: any) => {
//             console.log("ERROR --->", error);
//           });
//       } catch (error: any) {
//         console.log("ERROR --->", error);
//       }
//     })();
//     const reviews = await getReviews(
//       getFormattedYesterdayDate(),
//       getFormattedTodayDate(),
//       500
//     )
//       .then((reviews) => {
//         const reviewsMap = reviews.body.results.map((review: any) => {
//           return {
//             id: review.id,
//             title: review.title,
//             text: review.text,
//             rating: review.rating,
//             productId: review.target.id,
//             createdAt: review.createdAt,
//             lastModifiedAt: review.lastModifiedAt,
//           };
//         });
//         const productReviewsMap: ProductReviewsMap =
//           groupReviewsByProduct(reviewsMap);
//         console.log("Product Reviews Map:", productReviewsMap);
//         return productReviewsMap;
//       })
//       .catch(console.error);
//     console.log(reviews);
//     return {
//       statusCode: 200,
//       body: JSON.stringify(reviews),
//     };
//   } catch (error) {
//     console.error("Error fetching reviews:", error);
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: "Internal server error." }),
//     };
//   }
// };
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = graphqlBuilder(gqlQueries_1.queryAllProducts);
        console.log(data);
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    }
    catch (error) {
        console.error("Error fetching reviews:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error." }),
        };
    }
});
exports.handler = handler;
function graphqlBuilder(queryAllProducts) {
    throw new Error("Function not implemented.");
}
