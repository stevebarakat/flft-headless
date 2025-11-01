import { liteClient } from "algoliasearch/lite";

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "49WXAK2Z66";
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || "f49c08959e6093460bd40aa51c514b2e";
const indexName = "posts";

const client = liteClient(appId, apiKey);

async function testSearch() {
  try {
    console.log("Testing Algolia search...");
    console.log("App ID:", appId);
    console.log("Index:", indexName);

    const searchResponse = await client.searchSingleIndex({
      requests: [
        {
          indexName,
          query: "test",
        },
      ],
    });

    console.log("Search response:", JSON.stringify(searchResponse, null, 2));
    console.log("Hits found:", searchResponse.results[0]?.hits?.length || 0);

    if (searchResponse.results[0]?.hits?.length > 0) {
      console.log("\nFirst hit:", JSON.stringify(searchResponse.results[0].hits[0], null, 2));
    }
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
  }
}

testSearch();

