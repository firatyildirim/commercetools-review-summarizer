"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoot = exports.ctpClient = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const sdk_client_v2_1 = require("@commercetools/sdk-client-v2");
const platform_sdk_1 = require("@commercetools/platform-sdk");
require("dotenv/config");
const projectKey = process.env.CTP_PROJECT_KEY; //'ct-ai-exp';
const clientID = process.env.CTP_CLIENT_ID;
const clientSecret = process.env.CTP_CLIENT_SECRET;
const scopes = [process.env.CTP_SCOPES];
// Configure authMiddlewareOptions
const authMiddlewareOptions = {
    host: process.env.CTP_AUTH_URL, // 'https://auth.{region}.commercetools.com',
    projectKey: projectKey,
    credentials: {
        clientId: clientID,
        clientSecret: clientSecret,
    },
    scopes,
    fetch: node_fetch_1.default,
};
// Configure httpMiddlewareOptions
const httpMiddlewareOptions = {
    host: process.env.CTP_API_URL, // 'https://api.{region}.commercetools.com',
    fetch: // 'https://api.{region}.commercetools.com',
    node_fetch_1.default,
};
// Export the ClientBuilder
exports.ctpClient = new sdk_client_v2_1.ClientBuilder()
    .withProjectKey(projectKey) // .withProjectKey() is not required if the projectKey is included in authMiddlewareOptions
    .withClientCredentialsFlow(authMiddlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    //.withLoggerMiddleware() // Include middleware for logging
    .build();
exports.apiRoot = (0, platform_sdk_1.createApiBuilderFromCtpClient)(exports.ctpClient).withProjectKey({
    projectKey: projectKey,
});
