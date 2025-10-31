"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import type { WpMenu, WpSiteInfo, WpSocialLink } from "@/types/wp";
import { SocialLinks } from "@/components/SocialLinks";
import { Search } from "@/components/Search";
import styles from "./Header.module.css";

type HeaderProps = {
  menu: WpMenu | null;
  siteInfo: WpSiteInfo;
  socialLinks: WpSocialLink[];
};

export function Header({ menu, siteInfo, socialLinks }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {menu && menu.menuItems.nodes.length > 0 && (
          <button
            className={styles.hamburger}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}
        {menu && menu.menuItems.nodes.length > 0 && (
          <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
            <ul className={styles.menu}>
              {menu.menuItems.nodes.map((item) => {
                const href = item.path || item.url || "#";
                return (
                  <li key={item.id} className={styles.menuItem}>
                    <Link
                      href={href}
                      className={styles.menuLink}
                      onClick={() => setIsMenuOpen(false)}
                    >
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
                                onClick={() => setIsMenuOpen(false)}
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
        <div className={styles.topSection}>
          <div className={styles.socialLinksWrapper}>
            <SocialLinks links={socialLinks} orientation="horizontal" showText={false} />
          </div>
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
          <div className={styles.searchContainer}>
            <Search />
          </div>
        </div>
      </div>
    </header>
  );
}
