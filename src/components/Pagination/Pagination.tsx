import Link from "next/link";
import styles from "./Pagination.module.css";
import type { WpPageInfo } from "@/types/wp";

type PaginationProps = {
  currentPage: number;
  totalCount?: number;
  postsPerPage: number;
  pageInfo: WpPageInfo;
  getPageUrl: (page: number) => string;
};

export function Pagination({
  currentPage,
  totalCount,
  postsPerPage,
  pageInfo,
  getPageUrl,
}: PaginationProps) {
  return (
    <nav className={styles.pagination}>
      <span className={styles.pageNumbers}>
        {currentPage > 1 && (
          <>
            <Link href={getPageUrl(currentPage - 1)} className={styles.prevLink}>
              ← Prev
            </Link>
            {" "}
          </>
        )}
        {totalCount && (() => {
          const totalPages = Math.ceil(totalCount / postsPerPage);
          const pages = [];
          for (let i = 1; i <= totalPages; i++) {
            if (i > 1) {
              pages.push(" ");
            }
            if (i === currentPage) {
              pages.push(
                <span key={i} className={styles.currentPage}>
                  {i}
                </span>
              );
            } else {
              pages.push(
                <Link
                  key={i}
                  href={getPageUrl(i)}
                  className={styles.pageLink}
                >
                  {i}
                </Link>
              );
            }
          }
          return pages;
        })()}
        {(!totalCount || (pageInfo.hasNextPage && currentPage < Math.ceil((totalCount || 0) / postsPerPage))) && (
          <>
            {" "}
            <Link href={getPageUrl(currentPage + 1)} className={styles.nextLink}>
              Next →
            </Link>
          </>
        )}
      </span>
    </nav>
  );
}

