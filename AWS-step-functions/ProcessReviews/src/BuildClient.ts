import fetch from "node-fetch";
import {
  ClientBuilder,

  // Import middlewares
  type AuthMiddlewareOptions, // Required for auth
  type HttpMiddlewareOptions, // Required for sending HTTP requests
} from "@commercetools/sdk-client-v2";
import { createApiBuilderFromCtpClient } from "@commercetools/platform-sdk";
import "dotenv/config";

const projectKey = process.env.CTP_PROJECT_KEY!;
const clientID = process.env.CTP_CLIENT_ID!;
const clientSecret = process.env.CTP_CLIENT_SECRET!;
const scopes = [process.env.CTP_SCOPES!];

// Configure authMiddlewareOptions
const authMiddlewareOptions: AuthMiddlewareOptions = {
  host: process.env.CTP_AUTH_URL!,
  projectKey: projectKey,
  credentials: {
    clientId: clientID,
    clientSecret: clientSecret,
  },
  scopes,
  fetch,
};

// Configure httpMiddlewareOptions
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: process.env.CTP_API_URL!,
  fetch,
};

// Export the ClientBuilder
const ctpClient = new ClientBuilder()
  .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
  .withClientCredentialsFlow(authMiddlewareOptions)
  .withHttpMiddleware(httpMiddlewareOptions)
  //.withLoggerMiddleware() // Include middleware for logging
  .build();

export const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: projectKey,
});