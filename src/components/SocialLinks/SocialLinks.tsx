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
        >
          <Image
            src={link.iconUrl}
            alt={link.platform}
            width={40}
            height={40}
            className={styles.icon}
          />
          <span className={styles.text}>{link.platform}</span>
        </a>
      ))}
    </div>
  );
}

