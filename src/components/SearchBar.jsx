import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cuisines } from "../data/cuisines.js";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (q) => {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    const lower = q.toLowerCase();
    const matches = [];

    // Search cuisines
    Object.values(cuisines).forEach((c) => {
      if (c.name.toLowerCase().includes(lower)) {
        matches.push({ type: "cuisine", name: c.name, id: c.id });
      }
      // Search dishes
      c.dishes.forEach((d) => {
        if (d.name.toLowerCase().includes(lower)) {
          matches.push({
            type: "dish",
            name: d.name,
            cuisineId: c.id,
            cuisineName: c.name,
            dishType: d.type,
          });
        }
      });
    });

    setResults(matches.slice(0, 12));
    setOpen(matches.length > 0);
  };

  const handleSelect = (item) => {
    if (item.type === "cuisine") {
      navigate(`/cuisine/${item.id}`);
    } else {
      navigate(`/cuisine/${item.cuisineId}`);
    }
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div className="search-bar">
      <input
        type="search"
        placeholder="Search cuisines or dishes..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        aria-label="Search cuisines or dishes"
      />
      {open && (
        <div className="search-results">
          {results.map((item, i) => (
            <button
              key={`${item.name}-${i}`}
              type="button"
              className="search-result-item"
              onMouseDown={() => handleSelect(item)}
            >
              <span className="result-type">
                {item.type === "cuisine" ? "Cuisine" : item.dishType}
              </span>
              <span className="result-name">{item.name}</span>
              {item.cuisineName && (
                <span className="result-cuisine">{item.cuisineName}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
