import { apiRoot } from "./BuildClient";

const queryAllProducts = `
    query {
        listProducts {
        items {
            id
            name
            reviews {
            items {
                id
                rating
                content
            }
            }
        }
        }
    }
`;

function queryProjectSettings (){
    return const projectSettingsQuery = `
        query {
            project {
                name
                languages
                currencies
                countries
                version
                createdAt
            }
        }
    `;
};

function queryProductTypes(limit: int, offset: Int, where: String) {
    return const queryProductTypes = `
        query {
            listProductTypes(limit: ${limit}, offset: ${offset}, where: ${where}) {
            items {
                id
                name
                description
                products {
                items {
                    id
                    name
                    description
                }
                }
            }
        }
    }`;
};

function graphqlBuilder(inputQuery: any) {
  try {
    apiRoot
      .graphql()
      .post({
        body: {
          query: inputQuery,
          variables: {},
        },
      })
      .execute()
      .then((data: any) => {
        console.log("Project information --->", data);
        return data;
      })
      .catch((error: any) => {
        console.log("ERROR --->", error);
      });
  } catch (error: any) {
    console.log("ERROR --->", error);
  }
}

export { queryAllProducts };
