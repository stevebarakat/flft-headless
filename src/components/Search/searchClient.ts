import { liteClient } from "algoliasearch/lite";

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY;

if (!appId || !apiKey) {
  throw new Error(
    "Missing Algolia configuration. Please set NEXT_PUBLIC_ALGOLIA_APP_ID and NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY in your environment variables."
  );
}

const client = liteClient(appId, apiKey);

export const searchClient = {
  search: (requests: Array<{ indexName: string; params: any }>) => {
    return client
      .search({
        requests: requests.map((request) => ({
          indexName: request.indexName,
          query: request.params.query || "",
          ...request.params,
        })),
      })
      .then((response) => {
        if (!response || !response.results) {
          console.error("Unexpected Algolia response:", response);
          return {
            results: requests.map(() => ({
              hits: [],
              nbHits: 0,
              page: 0,
              nbPages: 0,
              hitsPerPage: 20,
              processingTimeMS: 0,
            })),
          };
        }
        return {
          results: response.results,
        };
      })
      .catch((error) => {
        console.error("Algolia search error:", error);
        return {
          results: requests.map(() => ({
            hits: [],
            nbHits: 0,
            page: 0,
            nbPages: 0,
            hitsPerPage: 20,
            processingTimeMS: 0,
            error: error.message,
          })),
        };
      });
  },
};

