import Image from "next/image";
import type { WpSocialLink } from "@/types/wp";
import styles from "./SocialLinks.module.css";

type SocialLinksProps = {
  links: WpSocialLink[];
};

export function SocialLinks({ links }: SocialLinksProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div className={styles.socialLinks}>
      {links.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
          aria-label={link.platform}
        >
          <Image
            src={link.iconUrl}
            alt={link.platform}
            width={24}
            height={24}
            className={styles.icon}
          />
        </a>
      ))}
    </div>
  );
}

