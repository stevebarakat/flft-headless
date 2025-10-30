import { GraphQLClient } from "graphql-request";

const WP_GRAPHQL_ENDPOINT = "http://localhost:10023/graphql";

export const wpClient = new GraphQLClient(WP_GRAPHQL_ENDPOINT);

