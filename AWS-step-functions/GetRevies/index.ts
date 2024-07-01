import { queryAllProducts } from "./src/gqlQueries";

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

export const handler = async (event: any, context: any) => {
  try {
    const data = graphqlBuilder(queryAllProducts);
    console.log(data);
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
function graphqlBuilder(queryAllProducts: string) {
  throw new Error("Function not implemented.");
}
