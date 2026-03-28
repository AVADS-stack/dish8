import { useRef } from "react";
import CuisineCard from "./CuisineCard.jsx";
import { cuisines } from "../data/cuisines.js";

export default function GenreRow({ genre }) {
  const scrollRef = useRef(null);

  const scrollBy = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir * 320,
        behavior: "smooth",
      });
    }
  };

  const genreCuisines = genre.cuisineIds
    .map((id) => cuisines[id])
    .filter(Boolean);

  return (
    <section className="genre-row">
      <h2 className="genre-title">{genre.title}</h2>
      <div className="genre-slider-wrapper">
        <button
          className="slider-arrow left"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll left"
        >
          ‹
        </button>
        <div className="genre-slider" ref={scrollRef}>
          {genreCuisines.map((c) => (
            <CuisineCard key={c.id} cuisine={c} />
          ))}
        </div>
        <button
          className="slider-arrow right"
          onClick={() => scrollBy(1)}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </section>
  );
}
