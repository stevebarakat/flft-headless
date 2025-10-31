"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./HeroSlider.module.css";
import type { WpSliderImage } from "@/types/wp";

type HeroSliderProps = {
  images: WpSliderImage[];
};

export function HeroSlider({ images }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  function goToPrevious() {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }

  function goToNext() {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={styles.slider}>
      <div className={styles.slideContainer}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`${styles.slide} ${
              index === currentIndex ? styles.active : ""
            }`}
          >
            <Image
              src={image.imageUrl}
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
