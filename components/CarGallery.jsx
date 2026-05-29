"use client";

import Image from "next/image";
import { useState } from "react";

export default function CarGallery({ car }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = car.images || [];
  const activeImage = images[activeIndex] || images[0];

  function goToImage(index) {
    if (!images.length) return;
    setActiveIndex((index + images.length) % images.length);
  }

  return (
    <section className="gallery-section">
      <div className="gallery-hero">
        <Image src={activeImage} alt={`${car.title} ${car.color}`} fill priority sizes="(max-width: 900px) 100vw, 65vw" />
        <span className="badge">{car.badge}</span>
        <button className="gallery-arrow left" type="button" aria-label="ดูรูปก่อนหน้า" onClick={() => goToImage(activeIndex - 1)}>
          ‹
        </button>
        <button className="gallery-arrow right" type="button" aria-label="ดูรูปถัดไป" onClick={() => goToImage(activeIndex + 1)}>
          ›
        </button>
      </div>
      <div className="thumb-strip">
        {images.slice(0, 6).map((image, index) => (
          <button
            className={`thumb ${index === activeIndex ? "active" : ""}`}
            key={image}
            type="button"
            aria-label={`ดูรูปที่ ${index + 1}`}
            onClick={() => goToImage(index)}
          >
            <Image src={image} alt={`${car.title} รูปที่ ${index + 1}`} fill sizes="120px" />
            {index === 5 && images.length > 6 ? <span>+{images.length - 5}</span> : null}
          </button>
        ))}
      </div>
    </section>
  );
}
