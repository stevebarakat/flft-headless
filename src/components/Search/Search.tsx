"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import {
  InstantSearch,
  SearchBox,
  useInstantSearch,
  useHits,
  useSearchBox,
} from "react-instantsearch";
import { searchClient } from "./searchClient";
import styles from "./Search.module.css";

type Hit = {
  objectID: string;
  title: string;
  uri: string;
  excerpt?: string;
};

function HitComponent({ hit }: { hit: Hit }) {
  return (
    <Link href={hit.uri} className={styles.hit}>
      <h3 className={styles.hitTitle}>{hit.title}</h3>
      {hit.excerpt && <p className={styles.hitExcerpt}>{hit.excerpt}</p>}
    </Link>
  );
}

function Results() {
  const { hits } = useHits<Hit>();
  const instantSearch = useInstantSearch();
  const { query } = useSearchBox();
  const status = instantSearch.status;

  if (!query || query.trim().length === 0) {
    return null;
  }

  if (status === "loading" || status === "stalled") {
    return (
      <div className={styles.empty}>
        <p>Searching...</p>
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No results found for &quot;{query}&quot;</p>
      </div>
    );
  }

  return (
    <ul className={styles.hitsList}>
      {hits.map((hit) => (
        <li key={hit.objectID}>
          <HitComponent hit={hit} />
        </li>
      ))}
    </ul>
  );
}

export function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div className={styles.searchWrapper} ref={searchRef}>
      <InstantSearch
        searchClient={searchClient}
        indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || "posts"}
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <SearchContent isOpen={isOpen} setIsOpen={setIsOpen} />
      </InstantSearch>
    </div>
  );
}

function SearchContent({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { hits } = useHits<Hit>();
  const { query } = useSearchBox();

  useEffect(() => {
    if (query && query.trim().length > 0 && hits.length > 0) {
      setIsOpen(true);
    }
  }, [query, hits.length, setIsOpen]);

  const showResults = isOpen && query && query.trim().length > 0;

  return (
    <div className={styles.searchContainer}>
      <div className={styles.inputWrapper}>
        <SearchIcon size={20} className={styles.searchIcon} />
        <SearchBox
          placeholder="Search..."
          classNames={{
            root: styles.searchBoxRoot,
            form: styles.searchBoxForm,
            input: styles.searchInput,
            submit: styles.searchSubmit,
            reset: styles.searchReset,
          }}
          onFocus={() => setIsOpen(true)}
        />
      </div>
      {showResults && (
        <div className={styles.results}>
          <Results />
        </div>
      )}
    </div>
  );
}
