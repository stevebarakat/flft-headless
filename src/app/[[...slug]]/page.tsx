import { notFound } from "next/navigation";
import Image from "next/image";
import { getPageByUri, getPostByUri } from "@/lib/wp-data";
import { Content } from "@/components/Content";
import { HeroSlider } from "@/components/HeroSlider";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const uri = slug ? `/${slug.join("/")}/` : "/";

  const page = await getPageByUri(uri);
  const post = page ? null : await getPostByUri(uri);

  const content = page || post;

  if (!content) {
    notFound();
  }

  const isHomepage = uri === "/";

  return (
    <>
      {isHomepage && <HeroSlider />}
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
    </>
  );
}

