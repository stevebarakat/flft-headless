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

type PostsResponse = {
  posts: {
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
    nodes: WpPost[];
  };
};

function stripHtml(html: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

async function fetchAllPosts(): Promise<WpPost[]> {
  const allPosts: WpPost[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;
  const first = 100;

  console.log("Fetching posts from WordPress (with pagination)...");

  while (hasNextPage) {
    const data = await wpClient.request<PostsResponse>(GET_ALL_POSTS, {
      first,
      after: cursor,
    });

    allPosts.push(...data.posts.nodes);
    hasNextPage = data.posts.pageInfo.hasNextPage;
    cursor = data.posts.pageInfo.endCursor;

    console.log(`  Fetched ${data.posts.nodes.length} posts (total: ${allPosts.length})`);
  }

  return allPosts;
}

async function fetchAllPages(): Promise<WpPage[]> {
  const allPages: WpPage[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;
  const first = 100;

  console.log("Fetching pages from WordPress (with pagination)...");

  while (hasNextPage) {
    const data = await wpClient.request<{
      pages: {
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string | null;
        };
        nodes: WpPage[];
      };
    }>(GET_ALL_PAGES, {
      first,
      after: cursor,
    });

    allPages.push(...data.pages.nodes);
    hasNextPage = data.pages.pageInfo.hasNextPage;
    cursor = data.pages.pageInfo.endCursor;

    console.log(`  Fetched ${data.pages.nodes.length} pages (total: ${allPages.length})`);
  }

  return allPages;
}

async function syncToAlgolia() {
  try {
    const posts = await fetchAllPosts();
    const pages = await fetchAllPages();

    console.log(`\nFound ${posts.length} posts and ${pages.length} pages`);

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

