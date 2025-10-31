import { notFound } from "next/navigation";
import Image from "next/image";
import { getPageByUri, getPostByUri, getCategoryPosts } from "@/lib/wp-data";
import { Content } from "@/components/Content";
import { CategoryArchive } from "@/components/CategoryArchive";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function DynamicPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
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

  const pageData = await getPageByUri(uri);
  const post = pageData ? null : await getPostByUri(uri);

  const content = pageData || post;

  if (!content) {
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

        {post && post.date && (
          <time className={styles.date} dateTime={post.date}>
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}

        <Content content={content.content} />
      </div>
    </article>
  );
}
