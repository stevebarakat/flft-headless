import { notFound } from "next/navigation";
import {
  getPageByUri,
  getSliderImages,
  getCallToAction,
  getLatestTipsAndTricks,
} from "@/lib/wp-data";
import { Content } from "@/components/Content";
import { HeroSlider } from "@/components/HeroSlider";
import { CallToAction } from "@/components/CallToAction";
import { LatestTipsAndTricks } from "@/components/LatestTipsAndTricks";
import styles from "./page.module.css";

export default async function HomePage() {
  const page = await getPageByUri("/");
  const sliderImages = await getSliderImages();
  const callToAction = await getCallToAction();
  const tipsAndTricks = await getLatestTipsAndTricks();

  if (!page) {
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
          <h1 className="visuallyHidden">{page.title}</h1>

          <Content content={page.content} />
        </div>
      </article>
    </>
  );
}
