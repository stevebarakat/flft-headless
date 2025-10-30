import Link from "next/link";
import Image from "next/image";
import type { WpMenu, WpSiteInfo } from "@/types/wp";
import styles from "./Header.module.css";

type HeaderProps = {
  menu: WpMenu | null;
  siteInfo: WpSiteInfo;
};

export function Header({ menu, siteInfo }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          <Link href="/" className={styles.logoContainer}>
            {siteInfo.logo?.url ? (
              <Image
                src={siteInfo.logo.url}
                alt={siteInfo.logo.altText || siteInfo.title}
                width={200}
                height={200}
                className={styles.logo}
                priority
              />
            ) : (
              <span className={styles.logoText}>{siteInfo.title}</span>
            )}
            {siteInfo.tagline && (
              <span className={styles.tagline}>{siteInfo.tagline}</span>
            )}
          </Link>
        </div>
        {menu && menu.menuItems.nodes.length > 0 && (
          <nav className={styles.nav}>
            <ul className={styles.menu}>
              {menu.menuItems.nodes.map((item) => {
                const href = item.path || item.url || "#";
                return (
                  <li key={item.id} className={styles.menuItem}>
                    <Link href={href} className={styles.menuLink}>
                      {item.label}
                    </Link>
                    {item.childItems && item.childItems.nodes.length > 0 && (
                      <ul className={styles.submenu}>
                        {item.childItems.nodes.map((child) => {
                          const childHref = child.path || child.url || "#";
                          return (
                            <li key={child.id}>
                              <Link
                                href={childHref}
                                className={styles.submenuLink}
                              >
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
