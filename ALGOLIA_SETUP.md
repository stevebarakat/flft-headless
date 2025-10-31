# Algolia Search Setup Guide

## Step 1: Create Algolia Account

1. Go to [https://www.algolia.com/](https://www.algolia.com/)
2. Sign up for a free account (Developer plan)
3. Create a new application (choose a name and region)

## Step 2: Get Your API Keys

1. In your Algolia Dashboard, go to **Settings** → **API Keys**
2. Copy your **Application ID**
3. Copy your **Search-Only API Key** (this is safe for client-side use)
4. Copy your **Admin API Key** (keep this secret, only for server-side indexing)

## Step 3: Create an Index

1. Go to **Search** → **Indices** in your Algolia dashboard
2. Click **Create Index**
3. Name it `posts` (or any name you prefer)
4. Leave it empty for now - we'll populate it with the sync script

## Step 4: Configure Environment Variables

Update your `env.local` file with your Algolia credentials:

```bash
# Client-side (public)
NEXT_PUBLIC_ALGOLIA_APP_ID=your_application_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_only_api_key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=posts

# Server-side (private - only for indexing)
ALGOLIA_APP_ID=your_application_id
ALGOLIA_ADMIN_API_KEY=your_admin_api_key
ALGOLIA_INDEX_NAME=posts

# WordPress GraphQL endpoint
WP_GRAPHQL_ENDPOINT=http://localhost:10023/graphql
```

**Important**:
- The `NEXT_PUBLIC_*` variables are exposed to the browser (safe for Search API Key)
- The `ALGOLIA_ADMIN_API_KEY` should NEVER be in `NEXT_PUBLIC_*` variables
- For production, add these to your hosting platform's environment variables

## Step 5: Configure Algolia Index Settings (Recommended)

1. Go to **Search** → **Indices** → Select your index → **Configuration**
2. In **Searchable attributes**, add: `title`, `excerpt`, `content` (in order of priority - title first, then excerpt, then content)
3. In **Attributes for faceting**, you can add `type` if you want to filter by post/page
4. In **Ranking and sorting**, ensure the attributes are prioritized: `title` (highest), `excerpt`, then `content`

**Note**: The order in searchable attributes matters - results matching in `title` will rank higher than matches in `content`.

## Step 6: Sync WordPress Content to Algolia

Run the sync script to push all your WordPress posts and pages to Algolia:

```bash
npm run sync-algolia
```

This script will:
- Fetch all posts and pages from your WordPress GraphQL API
- Format them for Algolia (with `title`, `uri`, `excerpt`, `type`)
- Push them to your Algolia index

You should run this script:
- Initially to populate the index
- Whenever you publish/update content (you can automate this with webhooks)
- On a schedule (e.g., daily) to keep content in sync

## Step 7: Test the Search

Start your Next.js development server:

```bash
npm run dev
```

Navigate to your site and test the search functionality in the header. Type some keywords to see results appear in the dropdown.

## Troubleshooting

### No search results appearing

1. **Check environment variables**: Make sure `NEXT_PUBLIC_ALGOLIA_APP_ID`, `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY`, and `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` are set correctly
2. **Verify index has data**: Go to Algolia Dashboard → Search → Indices → Your index → Browse. You should see records there
3. **Check browser console**: Look for any errors in the browser's developer console
4. **Verify WordPress connection**: Make sure your WordPress GraphQL endpoint is accessible and the sync script runs successfully

### Sync script errors

1. **WordPress connection**: Verify `WP_GRAPHQL_ENDPOINT` is correct and your WordPress site is running
2. **Algolia credentials**: Ensure `ALGOLIA_APP_ID` and `ALGOLIA_ADMIN_API_KEY` are set correctly
3. **Check network**: Make sure you can reach both WordPress and Algolia APIs

### Search not working in production

1. **Environment variables**: Ensure your hosting platform has the `NEXT_PUBLIC_*` environment variables set
2. **Build**: Rebuild your Next.js app after setting environment variables
3. **Check logs**: Review your hosting platform's logs for any errors

## Automating Sync (Optional)

To keep your Algolia index in sync with WordPress automatically, you can:

1. **Use webhooks**: Set up a WordPress webhook to trigger a sync when content is published/updated
2. **Use cron jobs**: Schedule the sync script to run periodically
3. **Use Algolia WordPress plugin**: Install a plugin that automatically syncs content on publish/update

## Next Steps

- Customize the search results styling in `src/components/Search/Search.module.css`
- Add filters or facets if needed (e.g., filter by category or post type)
- Configure search relevance in Algolia Dashboard
- Set up analytics in Algolia to track search usage

