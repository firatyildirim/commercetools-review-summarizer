import fetch from 'node-fetch';
import {
  ClientBuilder,
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import {
  ApiRoot,
  ByProjectKeyRequestBuilder,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';

const projectKey = 'kaantest';
const scopes = ['manage_project:kaantest'];

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: 'https://auth.eu-central-1.aws.commercetools.com',
  projectKey: projectKey,
  credentials: {
    clientId: 'jtv5QaPf1MAcrGyLkeXh6J2E',
    clientSecret: 'EgoGNxUYzfBeEi2kDr-c_WTPPx7IwKFF',
  },
  scopes,
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: 'https://api.eu-central-1.aws.commercetools.com',
  fetch,
};

// Export the ClientBuilder
const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware() // Include middleware for logging
  .build();

const apiRoot = createApiBuilderFromCtpClient(ctpClient)
  .withProjectKey({ projectKey: projectKey });


//Placeholder method  
const getCustomers = async (apiRoot: ByProjectKeyRequestBuilder) => {
    return  apiRoot.customers().get().execute()
        .then(res => {
            return res.body.results;
        })
        .catch(err => { console.log("Error:", err) });
}

export const handler = async (event: any, context: any) => {
  try {

    // Customers query will be changed to get reviews query from Deniz
    const customers = await getCustomers(apiRoot);

    if (!customers) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No reviews found.' }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(customers),
    };
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error.' }),
    };
  }
};

