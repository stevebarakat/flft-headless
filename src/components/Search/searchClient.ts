import { liteClient } from "algoliasearch/lite";

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;

if (!appId || !apiKey) {
  throw new Error(
    "Missing Algolia configuration. Please set NEXT_PUBLIC_ALGOLIA_APP_ID and NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY in your environment variables."
  );
}

export const searchClient = liteClient(appId, apiKey);

