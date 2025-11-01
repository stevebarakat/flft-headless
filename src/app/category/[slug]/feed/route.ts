import { getCategoryPostsForRSS, getSiteInfo } from "@/lib/wp-data";
import { stripHtml } from "@/lib/utils";

type RouteParams = {
  params: Promise<{ slug: string }>;
};

function escapeXml(unsafe: string | null): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatRssDate(dateString: string): string {
  return new Date(dateString).toUTCString();
}

export async function GET(_request: Request, { params }: RouteParams) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const categoryData = await getCategoryPostsForRSS(slug);
  const siteInfo = await getSiteInfo();

  if (!categoryData || !categoryData.category || !categoryData.posts || categoryData.posts.length === 0) {
    return new Response("Category not found or no posts available", { status: 404 });
  }

  const baseUrl = siteInfo.url.replace(/\/$/, "");
  const feedUrl = `${baseUrl}/category/${slug}/feed`;
  const categoryUrl = `${baseUrl}/category/${slug}`;
  const categoryName = categoryData.category.name;

  const rssItems = categoryData.posts
    .map((post) => {
      const postUrl = post.uri.startsWith("/")
        ? `${baseUrl}${post.uri}`
        : `${baseUrl}/${post.uri}`;
      const postDate = formatRssDate(post.date);
      const title = escapeXml(post.title || "");
      const descriptionText = escapeXml(
        post.content ? stripHtml(post.content) : stripHtml(post.excerpt)
      );
      const descriptionHtml = post.content || post.excerpt || "";
      const author = escapeXml(post.author?.node?.name || "");

      let itemXml = `<item>
    <title>${title}</title>
    <link>${postUrl}</link>
    <guid isPermaLink="true">${postUrl}</guid>
    <pubDate>${postDate}</pubDate>`;

      if (descriptionText) {
        itemXml += `\n    <description>${descriptionText}</description>`;
      }

      if (descriptionHtml) {
        const cdataContent = descriptionHtml.replace(/]]>/g, "]]]]><![CDATA[>");
        itemXml += `\n    <content:encoded><![CDATA[${cdataContent}]]></content:encoded>`;
      }

      if (author) {
        itemXml += `\n    <dc:creator>${author}</dc:creator>`;
      }

      if (post.featuredImage?.node?.sourceUrl) {
        const imageUrl = post.featuredImage.node.sourceUrl;
        itemXml += `\n    <enclosure url="${escapeXml(imageUrl)}" type="image/jpeg" />`;
      }

      itemXml += `\n  </item>`;

      return itemXml;
    })
    .join("\n");

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteInfo.title)} - ${escapeXml(categoryName)}</title>
    <link>${categoryUrl}</link>
    <description>${escapeXml(siteInfo.tagline || `Posts in ${categoryName}`)}</description>
    <language>en-US</language>
    <lastBuildDate>${formatRssDate(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
