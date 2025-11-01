import { GraphQLClient } from "graphql-request";

const WP_GRAPHQL_ENDPOINT =
  process.env.WP_GRAPHQL_ENDPOINT || "https://old.flft-headless.online/graphql";

if (!process.env.WP_GRAPHQL_ENDPOINT) {
  console.warn(
    "WP_GRAPHQL_ENDPOINT not set, using default:",
    WP_GRAPHQL_ENDPOINT
  );
}

export const wpClient = new GraphQLClient(WP_GRAPHQL_ENDPOINT);
