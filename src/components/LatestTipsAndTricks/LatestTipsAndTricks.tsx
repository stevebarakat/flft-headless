import Link from "next/link";
import Image from "next/image";
import styles from "./LatestTipsAndTricks.module.css";
import type { WpPost } from "@/types/wp";

type LatestTipsAndTricksProps = {
  posts: WpPost[];
};

function stripHtml(html: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

export function LatestTipsAndTricks({ posts }: LatestTipsAndTricksProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Latest Tips & Tricks</h2>
        <div className={styles.cards}>
          {posts.map((post) => {
            const excerpt = truncateText(stripHtml(post.excerpt || ""));
            const image = post.featuredImage?.node;

            return (
              <article key={post.id} className={styles.card}>
                {image && (
                  <div className={styles.imageWrapper}>
                    <Image
                      src={image.sourceUrl}
                      alt={image.altText || post.title}
                      fill
                      className={styles.image}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                )}
                <h3 className={styles.title}>{post.title}</h3>
                {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
                <Link href={post.uri} className={styles.button}>
                  Read More
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

