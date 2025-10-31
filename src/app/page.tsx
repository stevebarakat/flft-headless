import { notFound } from "next/navigation";
import Image from "next/image";
import { getPageByUri, getSliderImages } from "@/lib/wp-data";
import { Content } from "@/components/Content";
import { HeroSlider } from "@/components/HeroSlider";
import styles from "./[[...slug]]/page.module.css";

export default async function HomePage() {
  const page = await getPageByUri("/");
  const sliderImages = await getSliderImages();

  if (!page) {
    notFound();
  }

  return (
    <>
      <HeroSlider images={sliderImages} />
      <article className={styles.article}>
        <div className={styles.container}>
          <h1 className={styles.title}>{page.title}</h1>

          {page.featuredImage?.node && (
            <div className={styles.featuredImage}>
              <Image
                src={page.featuredImage.node.sourceUrl}
                alt={page.featuredImage.node.altText || page.title}
                width={page.featuredImage.node.mediaDetails?.width || 1200}
                height={page.featuredImage.node.mediaDetails?.height || 600}
                className={styles.image}
              />
            </div>
          )}

          <Content content={page.content} />
        </div>
      </article>
    </>
  );
}
