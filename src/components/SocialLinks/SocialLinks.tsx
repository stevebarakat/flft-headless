import Image from "next/image";
import type { WpSocialLink } from "@/types/wp";
import styles from "./SocialLinks.module.css";

type SocialLinksProps = {
  links: WpSocialLink[];
  orientation?: "horizontal" | "vertical";
  showText?: boolean;
};

export function SocialLinks({
  links,
  orientation = "vertical",
  showText = true,
}: SocialLinksProps) {
  if (links.length === 0) {
    return null;
  }

  const containerClass =
    orientation === "horizontal"
      ? styles.socialLinksHorizontal
      : styles.socialLinks;

  return (
    <div className={containerClass}>
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          aria-label={showText ? undefined : link.platform}
        >
          <Image
            src={link.iconUrl}
            alt={link.platform}
            width={40}
            height={40}
            className={styles.icon}
          />
          {showText && <span className={styles.text}>{link.platform}</span>}
        </a>
      ))}
    </div>
  );
}

