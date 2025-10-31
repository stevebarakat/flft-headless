import Link from "next/link";
import styles from "./CallToAction.module.css";
import type { WpCallToAction } from "@/types/wp";

type CallToActionProps = {
  data: WpCallToAction;
};

export function CallToAction({ data }: CallToActionProps) {
  if (!data.isEnabled) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.textSection}>
          <div className={styles.headingRow}>
            <h2 className={styles.heading}>
              {data.heading}{" "}
              <a
                href={data.phoneNumberLink || `tel:${data.phoneNumber}`}
                className={styles.phoneNumber}
              >
                {data.phoneNumber}
              </a>
            </h2>
          </div>
          <div className={styles.descriptionRow}>
            <span className={styles.description}>
              {data.description}{" "}
              <Link href={data.linkUrl || "#"} className={styles.link}>
                {data.linkText}
              </Link>
            </span>
          </div>
        </div>
        <div className={styles.buttonSection}>
          <Link href={data.ctaButtonUrl || "#"} className={styles.button}>
            {data.ctaButtonText}
          </Link>
        </div>
      </div>
    </div>
  );
}
