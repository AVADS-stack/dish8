import { useNavigate } from "react-router-dom";
import { getCuisineImageUrl } from "../data/images.js";

export default function CuisineCard({ cuisine }) {
  const navigate = useNavigate();
  const imageUrl = getCuisineImageUrl(cuisine.id);

  return (
    <div
      className="cuisine-card"
      onClick={() => navigate(`/cuisine/${cuisine.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/cuisine/${cuisine.id}`)}
    >
      <div className="cuisine-card-bg">
        <img src={imageUrl} alt={`${cuisine.name} cuisine`} loading="lazy" />
        <div className="cuisine-card-overlay" />
      </div>
      <div className="cuisine-card-info">
        <h3>{cuisine.name}</h3>
      </div>
    </div>
  );
}
