"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./HeroSlider.module.css";

const images = [
  "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=970&h=645&fit=crop",
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=970&h=645&fit=crop",
  "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=970&h=645&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=970&h=645&fit=crop",
  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=970&h=645&fit=crop",
  "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=970&h=645&fit=crop",
];

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function goToPrevious() {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  function goToNext() {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }

  return (
    <div className={styles.slider}>
      <div className={styles.slideContainer}>
        {images.map((src, index) => (
          <div
            key={index}
            className={`${styles.slide} ${
              index === currentIndex ? styles.active : ""
            }`}
          >
            <Image
              src={src}
              alt={`Hero image ${index + 1}`}
              width={970}
              height={645}
              priority={index === 0}
              className={styles.image}
            />
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <button
          className={styles.navButton}
          onClick={goToPrevious}
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className={styles.navButton}
          onClick={goToNext}
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
