import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { cuisines } from "../data/cuisines.js";
import { getCuisineImageUrl } from "../data/images.js";
import DishCard from "../components/DishCard.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useSubscription } from "../context/SubscriptionContext.jsx";

export default function CuisineDishes() {
  const { cuisineId } = useParams();
  const cuisine = cuisines[cuisineId];
  const { DAYS } = useCart();
  const { activePlan } = useSubscription();
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [selectedMealTime, setSelectedMealTime] = useState("lunch");
  const [filter, setFilter] = useState("all");

  if (!cuisine) {
    return (
      <div className="error-page">
        <h2>Cuisine not found</h2>
        <Link to="/" className="btn btn-primary">Back to Browse</Link>
      </div>
    );
  }

  const mealTimes = activePlan ? activePlan.meals : ["lunch", "dinner"];

  const filteredDishes =
    filter === "all"
      ? cuisine.dishes
      : cuisine.dishes.filter((d) => d.type === filter);

  return (
    <div className="cuisine-dishes-page">
      {/* Header */}
      <div className="cuisine-header">
        <Link to="/" className="back-link">← Back to Cuisines</Link>
        <div className="cuisine-title-row">
          <img
            src={getCuisineImageUrl(cuisineId)}
            alt={cuisine.name}
            className="cuisine-hero-img"
          />
          <div>
            <h1>{cuisine.name} Cuisine</h1>
            <p>{cuisine.description}</p>
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div className="day-selector">
        <div className="day-tabs">
          {DAYS.map((day) => (
            <button
              key={day}
              className={`day-tab ${selectedDay === day ? "active" : ""}`}
              onClick={() => setSelectedDay(day)}
            >
              {day.slice(0, 3)}
              <span className="day-full">{day}</span>
            </button>
          ))}
        </div>
        <div className="meal-time-tabs">
          {mealTimes.map((mt) => (
            <button
              key={mt}
              className={`meal-tab ${selectedMealTime === mt ? "active" : ""}`}
              onClick={() => setSelectedMealTime(mt)}
            >
              {mt === "lunch" ? "🌮 Lunch" : "🍷 Dinner"}
            </button>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="dish-filters">
        {["all", "appetizer", "main", "side"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all"
              ? "All"
              : f === "main"
              ? "Main Course"
              : f === "appetizer"
              ? "Appetizers"
              : "Side Dish"}
          </button>
        ))}
      </div>

      {/* Info banner */}
      <div className="meal-info-banner">
        Each meal = 2 Appetizers + 1 Main Course + 1 Side Dish — $9.99/meal
      </div>

      {/* Dishes Grid */}
      <div className="dishes-grid">
        {filteredDishes.map((dish) => (
          <DishCard
            key={dish.name}
            dish={dish}
            cuisineId={cuisineId}
            selectedDay={selectedDay}
            selectedMealTime={selectedMealTime}
          />
        ))}
      </div>

      {/* Selection summary for current day */}
      <MealSummaryBar day={selectedDay} mealTime={selectedMealTime} />
    </div>
  );
}

function MealSummaryBar({ day, mealTime }) {
  const { getMeal, isMealComplete } = useCart();
  const meal = getMeal(day, mealTime);
  const complete = isMealComplete(day, mealTime);

  return (
    <div className={`meal-summary-bar ${complete ? "complete" : ""}`}>
      <div className="summary-inner">
        <h3>
          {day} {mealTime === "lunch" ? "Lunch" : "Dinner"}
        </h3>
        <div className="summary-slots">
          <span className={meal.appetizer1 ? "filled" : ""}>
            {meal.appetizer1 ? `✓ ${meal.appetizer1.name}` : "— Appetizer 1"}
          </span>
          <span className={meal.appetizer2 ? "filled" : ""}>
            {meal.appetizer2 ? `✓ ${meal.appetizer2.name}` : "— Appetizer 2"}
          </span>
          <span className={meal.main ? "filled" : ""}>
            {meal.main ? `✓ ${meal.main.name}` : "— Main Course"}
          </span>
          <span className={meal.side ? "filled" : ""}>
            {meal.side ? `✓ ${meal.side.name}` : "— Side Dish"}
          </span>
        </div>
        {complete && (
          <Link to="/cart" className="btn btn-primary btn-sm">
            View Cart
          </Link>
        )}
      </div>
    </div>
  );
}
