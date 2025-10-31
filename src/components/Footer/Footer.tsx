import Image from "next/image";
import Link from "next/link";
import type { WpMenu, WpSiteInfo, WpSocialLink, WpPost } from "@/types/wp";
import { SocialLinks } from "@/components/SocialLinks";
import styles from "./Footer.module.css";

type FooterProps = {
  menu: WpMenu | null;
  siteInfo: WpSiteInfo;
  socialLinks: WpSocialLink[];
  latestPosts: WpPost[];
};

export function Footer({
  menu,
  siteInfo,
  socialLinks,
  latestPosts,
}: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.logoColumn}>
            <Link href="/" className={styles.logoContainer}>
              {siteInfo.logo?.url ? (
                <Image
                  src={siteInfo.logo.url}
                  alt={siteInfo.logo.altText || siteInfo.title}
                  width={150}
                  height={150}
                  className={styles.logo}
                />
              ) : (
                <span className={styles.logoText}>{siteInfo.title}</span>
              )}
            </Link>
          </div>

          <div className={styles.socialColumn}>
            <h3 className={styles.sectionTitle}>Follow Us</h3>
            <SocialLinks
              links={socialLinks}
              orientation="vertical"
              showText={true}
            />
          </div>

          {menu && menu.menuItems.nodes.length > 0 && (
            <nav className={styles.nav}>
              <h3 className={styles.sectionTitle}>Navigation</h3>
              <ul className={styles.menu}>
                {menu.menuItems.nodes.map((item) => {
                  const href = item.path || item.url || "#";
                  return (
                    <li key={item.id}>
                      <Link href={href} className={styles.menuLink}>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}

          {latestPosts.length > 0 && (
            <nav className={styles.nav}>
              <h3 className={styles.sectionTitle}>Latest Tips & Tricks</h3>
              <ul className={styles.menu}>
                {latestPosts.slice(0, 3).map((post) => {
                  const truncatedTitle =
                    post.title.length > 40
                      ? post.title.substring(0, 40).trim() + "..."
                      : post.title;
                  return (
                    <li key={post.id}>
                      <Link href={post.uri} className={styles.menuLink}>
                        {truncatedTitle}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {siteInfo.title}. All rights reserved.
          </p>
          <p className={styles.copyright}>
            Headless WordPress site by{" "}
            <a
              className={styles.menuLink}
              href="https://www.stevebarakat.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Steve Barakat
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
