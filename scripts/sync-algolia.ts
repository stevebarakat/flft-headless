import { config } from "dotenv";
import { resolve } from "path";
import { algoliasearch } from "algoliasearch";
import { GraphQLClient } from "graphql-request";
import { GET_ALL_POSTS, GET_ALL_PAGES } from "../src/lib/graphql/queries";

config({ path: resolve(__dirname, "../env.local") });

const WP_GRAPHQL_ENDPOINT = process.env.WP_GRAPHQL_ENDPOINT || "http://localhost:10023/graphql";

const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID || "";
const ALGOLIA_ADMIN_API_KEY = process.env.ALGOLIA_ADMIN_API_KEY || "";
const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME || "posts";

if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_API_KEY) {
  console.error(
    "Error: ALGOLIA_APP_ID and ALGOLIA_ADMIN_API_KEY must be set in environment variables"
  );
  process.exit(1);
}

const wpClient = new GraphQLClient(WP_GRAPHQL_ENDPOINT);
const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY);

type WpPost = {
  id: string;
  title: string;
  slug: string;
  uri: string;
  date: string;
  excerpt: string | null;
};

type WpPage = {
  id: string;
  title: string;
  slug: string;
  uri: string;
};

function stripHtml(html: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

async function syncToAlgolia() {
  try {
    console.log("Fetching posts from WordPress...");
    const postsData = await wpClient.request<{ posts: { nodes: WpPost[] } }>(
      GET_ALL_POSTS
    );
    const posts = postsData.posts.nodes;

    console.log("Fetching pages from WordPress...");
    const pagesData = await wpClient.request<{ pages: { nodes: WpPage[] } }>(
      GET_ALL_PAGES
    );
    const pages = pagesData.pages.nodes;

    console.log(`Found ${posts.length} posts and ${pages.length} pages`);

    const records = [
      ...posts.map((post) => ({
        objectID: post.id,
        title: post.title,
        uri: post.uri,
        excerpt: stripHtml(post.excerpt),
        type: "post",
      })),
      ...pages.map((page) => ({
        objectID: page.id,
        title: page.title,
        uri: page.uri,
        excerpt: null,
        type: "page",
      })),
    ];

    console.log(`Syncing ${records.length} records to Algolia...`);
    await searchClient.saveObjects({
      indexName: ALGOLIA_INDEX_NAME,
      objects: records,
    });

    console.log("✅ Successfully synced all content to Algolia!");
    console.log(`   Index: ${ALGOLIA_INDEX_NAME}`);
    console.log(`   Records: ${records.length}`);
  } catch (error) {
    console.error("Error syncing to Algolia:", error);
    process.exit(1);
  }
}

syncToAlgolia();

