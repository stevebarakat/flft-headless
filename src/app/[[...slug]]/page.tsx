import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPageByUri, getPostByUri, getPostBySlug, getCategoryPosts } from "@/lib/wp-data";
import { Content } from "@/components/Content";
import { CategoryArchive } from "@/components/CategoryArchive";
import type { WpPost } from "@/types/wp";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function DynamicPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const { page } = await searchParams;

  if (!slug || slug.length === 0) {
    notFound();
  }

  const uri = `/${slug.join("/")}/`;

  if (slug.length === 2 && slug[0] === "category") {
    const categorySlug = slug[1];
    const currentPage = page ? parseInt(page, 10) : 1;
    const categoryData = await getCategoryPosts(categorySlug, 4);

    if (!categoryData || !categoryData.category) {
      notFound();
    }

    return (
      <CategoryArchive
        posts={categoryData.posts.nodes}
        category={categoryData.category}
        pageInfo={categoryData.posts.pageInfo}
        currentPage={currentPage}
      />
    );
  }

  console.log("🔍 Fetching content for URI:", uri);
  console.log("🔍 Slug array:", slug);

  let pageData = await getPageByUri(uri);
  console.log("📄 Page data:", pageData ? `Found - Title: ${pageData.title}` : "Not found");

  let post: WpPost | null = null;

  if (!pageData || !pageData.title || !pageData.content) {
    if (slug.length > 0) {
      const postSlug = slug.length === 1 ? slug[0] : slug.join("/");
      console.log("🔍 Trying to fetch post by slug:", postSlug);
      post = await getPostBySlug(postSlug);
      console.log("📝 Post by slug:", post ? `Found - Title: ${post.title}` : "Not found");

      if (!post) {
        console.log("🔍 Trying to fetch post by URI:", uri);
        post = await getPostByUri(uri);
        console.log("📝 Post by URI:", post ? `Found - Title: ${post.title}` : "Not found");
      }

      if (!post && slug.length > 1) {
        console.log("🔍 Trying last slug segment:", slug[slug.length - 1]);
        post = await getPostBySlug(slug[slug.length - 1]);
        console.log("📝 Post by last slug:", post ? `Found - Title: ${post.title}` : "Not found");
      }
    } else {
      post = await getPostByUri(uri);
    }
  }

  const content = (pageData && pageData.title && pageData.content) ? pageData : post;
  console.log("✅ Final content:", content ? `Found - Title: ${content.title}` : "Not found");

  if (!content) {
    console.log("❌ Content not found, calling notFound()");
    notFound();
  }

  return (
    <article className={styles.article}>
      <div className={styles.container}>
        <h1 className={styles.title}>{content.title}</h1>

        {content.featuredImage?.node && (
          <div className={styles.featuredImage}>
            <Image
              src={content.featuredImage.node.sourceUrl}
              alt={content.featuredImage.node.altText || content.title}
              width={content.featuredImage.node.mediaDetails?.width || 1200}
              height={content.featuredImage.node.mediaDetails?.height || 600}
              className={styles.image}
            />
          </div>
        )}

        {post && (
          <div className={styles.postMeta}>
            {post.date && (
              <time className={styles.date} dateTime={post.date}>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            {post.author?.node && (
              <span className={styles.author}>
                By {post.author.node.name}
              </span>
            )}
            {post.categories?.nodes && post.categories.nodes.length > 0 && (
              <div className={styles.categories}>
                {post.categories.nodes.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className={styles.categoryLink}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        <Content content={content.content} />
      </div>
    </article>
  );
}
