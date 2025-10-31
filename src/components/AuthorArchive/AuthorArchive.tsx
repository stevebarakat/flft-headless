import Link from "next/link";
import Image from "next/image";
import styles from "./AuthorArchive.module.css";
import type { WpPost, WpAuthor, WpPageInfo } from "@/types/wp";
import { stripHtml } from "@/lib/utils";

type AuthorArchiveProps = {
  posts: WpPost[];
  author: WpAuthor | null;
  pageInfo: WpPageInfo;
  currentPage?: number;
  totalCount?: number;
  postsPerPage?: number;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getAuthorSlug(authorName: string): string {
  return authorName.toLowerCase().replace(/\s+/g, "-");
}

function getCommentText(count: number | null | undefined): string {
  if (!count || count === 0) return "Leave a comment";
  if (count === 1) return "1 Comment";
  return `${count} Comments`;
}

export function AuthorArchive({
  posts,
  author,
  pageInfo,
  currentPage = 1,
  totalCount,
  postsPerPage = 2,
}: AuthorArchiveProps) {
  const authorName = author?.name || "Unknown Author";

  return (
    <article className={styles.archive}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            Archive | {authorName}
          </h1>
        </header>

        <div className={styles.posts}>
          {posts.map((post) => {
            const excerpt = stripHtml(post.excerpt);
            const commentText = getCommentText(post.commentCount);
            const authorName = post.author?.node?.name || "";

            return (
              <article key={post.id} className={styles.post}>
                <div className="metadata">
                  <time className="date" dateTime={post.date}>
                    {formatDate(post.date)}
                  </time>
                  {authorName && (
                    <Link href={`/author/${getAuthorSlug(authorName)}`} className="author">
                      {authorName}
                    </Link>
                  )}
                  {post.categories?.nodes && post.categories.nodes.length > 0 && (
                    <div className="categories">
                      {post.categories.nodes.map((cat, index) => (
                        <span key={cat.slug}>
                          {index > 0 && ", "}
                          <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
                        </span>
                      ))}
                    </div>
                  )}
                  <Link href={`${post.uri}#comments`} className="comments">
                    {commentText}
                  </Link>
                </div>

                <div className={styles.content}>
                  <h2 className={styles.postTitle}>
                    <Link href={post.uri}>{post.title}</Link>
                  </h2>

                  {post.featuredImage?.node && (
                    <div className={styles.imageWrapper}>
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.featuredImage.node.altText || post.title}
                        width={post.featuredImage.node.mediaDetails?.width || 600}
                        height={post.featuredImage.node.mediaDetails?.height || 400}
                        className={styles.image}
                      />
                    </div>
                  )}

                  {excerpt && (
                    <p className={styles.excerpt}>{excerpt}</p>
                  )}

                  <Link href={post.uri} className={styles.continueLink}>
                    Continue Reading →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <nav className={styles.pagination}>
          <span className={styles.pageNumbers}>
            {currentPage > 1 && (
              <>
                <Link
                  href={`/author/${author?.slug || "unknown"}?page=${currentPage - 1}`}
                  className={styles.prevLink}
                >
                  ← Prev
                </Link>
                {" "}
              </>
            )}
            {totalCount && (() => {
              const totalPages = Math.ceil(totalCount / postsPerPage);
              const pages = [];
              for (let i = 1; i <= totalPages; i++) {
                if (i > 1) {
                  pages.push(" ");
                }
                if (i === currentPage) {
                  pages.push(
                    <span key={i} className={styles.currentPage}>
                      {i}
                    </span>
                  );
                } else {
                  pages.push(
                    <Link
                      key={i}
                      href={`/author/${author?.slug || "unknown"}?page=${i}`}
                      className={styles.pageLink}
                    >
                      {i}
                    </Link>
                  );
                }
              }
              return pages;
            })()}
            {(!totalCount || (pageInfo.hasNextPage && currentPage < Math.ceil((totalCount || 0) / postsPerPage))) && (
              <>
                {" "}
                <Link
                  href={`/author/${author?.slug || "unknown"}?page=${currentPage + 1}`}
                  className={styles.nextLink}
                >
                  Next →
                </Link>
              </>
            )}
          </span>
        </nav>
      </div>
    </article>
  );
}

