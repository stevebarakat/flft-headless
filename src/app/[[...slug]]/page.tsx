import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPageByUri,
  getPostByUri,
  getPostBySlug,
  getCategoryPosts,
  getSliderImages,
  getCallToAction,
  getLatestTipsAndTricks,
} from "@/lib/wp-data";
import { Content } from "@/components/Content";
import { CategoryArchive } from "@/components/CategoryArchive";
import { HeroSlider } from "@/components/HeroSlider";
import { CallToAction } from "@/components/CallToAction";
import { LatestTipsAndTricks } from "@/components/LatestTipsAndTricks";
import { Comments } from "@/components/Comments";
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
    const homepage = await getPageByUri("/");
    const sliderImages = await getSliderImages();
    const callToAction = await getCallToAction();
    const tipsAndTricks = await getLatestTipsAndTricks();

    if (!homepage) {
      notFound();
    }

    return (
      <>
        <HeroSlider images={sliderImages} />
        {callToAction && <CallToAction data={callToAction} />}
        {tipsAndTricks.length > 0 && (
          <LatestTipsAndTricks posts={tipsAndTricks} />
        )}
        <article className={styles.article}>
          <div className={styles.container}>
            <h1 className="visuallyHidden">{homepage.title}</h1>
            <Content content={homepage.content} />
          </div>
        </article>
      </>
    );
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

  let pageData = await getPageByUri(uri);
  let post: WpPost | null = null;

  if (!pageData || !pageData.title || !pageData.content) {
    if (slug.length > 0) {
      const postSlug = slug.length === 1 ? slug[0] : slug.join("/");
      post = await getPostBySlug(postSlug);

      if (!post) {
        post = await getPostByUri(uri);
      }

      if (!post && slug.length > 1) {
        post = await getPostBySlug(slug[slug.length - 1]);
      }
    } else {
      post = await getPostByUri(uri);
    }
  }

  const content =
    pageData && pageData.title && pageData.content ? pageData : post;

  if (!content) {
    notFound();
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCategories = (categories: WpPost["categories"]): string => {
    if (!categories?.nodes || categories.nodes.length === 0) return "";
    return categories.nodes.map((cat) => cat.name).join(", ");
  };

  const getCommentText = (count: number | null | undefined): string => {
    if (!count || count === 0) return "Leave a comment";
    if (count === 1) return "1 Comment";
    return `${count} Comments`;
  };

  return (
    <article className={styles.article}>
      <div className={styles.container}>
        {post ? (
          <>
            <div className={styles.post}>
              <div className={styles.metadata}>
                {post.date && (
                  <time className={styles.date} dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                )}
                {post.author?.node && (
                  <div className={styles.author}>{post.author.node.name}</div>
                )}
                {post.categories && formatCategories(post.categories) && (
                  <div className={styles.categories}>
                    {formatCategories(post.categories)}
                  </div>
                )}
                <div className={styles.comments}>
                  {getCommentText(post.commentCount)}
                </div>
              </div>

              <div className={styles.content}>
                <h1 className={styles.title}>{content.title}</h1>
                <Content content={content.content} />
              </div>
            </div>

            {post.databaseId && (
              <Comments
                postId={post.databaseId}
                comments={post.comments?.nodes || []}
              />
            )}
          </>
        ) : (
          <>
            <h1 className={styles.title}>{content.title}</h1>
            <Content content={content.content} />
          </>
        )}
      </div>
    </article>
  );
}
