import { useState } from "react";
import { Link } from "react-router-dom";
import { cuisines } from "../data/cuisines.js";
import { useCart } from "../context/CartContext.jsx";
import { useSubscription } from "../context/SubscriptionContext.jsx";
import SEO from "../components/SEO.jsx";
import DishCard from "../components/DishCard.jsx";

export default function WeeklyMenu() {
  const { DAYS } = useCart();
  const { activePlan } = useSubscription();
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [selectedMealTime, setSelectedMealTime] = useState("lunch");
  const [selectedCuisine, setSelectedCuisine] = useState("italian");
  const { isMealComplete } = useCart();

  const mealTimes = activePlan ? activePlan.meals : ["lunch", "dinner"];
  const cuisine = cuisines[selectedCuisine];

  return (
    <div className="weekly-page">
      <SEO
        title="Weekly Menu Builder"
        description="Build your weekly meal plan from 19+ world cuisines. Select 2 appetizers, a main course, and a side for each day."
        path="/weekly"
      />
      <div className="weekly-header">
        <h1>Build Your Weekly Menu</h1>
        <p>
          Select a day, choose your meal time, pick a cuisine, then add 2
          appetizers, a main course, and a side dish.
        </p>
        {!activePlan && (
          <Link to="/plans" className="btn btn-primary">
            Subscribe first — from $99.99/mo
          </Link>
        )}
      </div>

      {/* Day tabs */}
      <div className="day-selector weekly-days">
        <div className="day-tabs">
          {DAYS.map((day) => {
            const hasLunch = isMealComplete(day, "lunch");
            const hasDinner = isMealComplete(day, "dinner");
            return (
              <button
                key={day}
                className={`day-tab ${selectedDay === day ? "active" : ""} ${
                  hasLunch || hasDinner ? "has-meals" : ""
                }`}
                onClick={() => setSelectedDay(day)}
              >
                <span className="day-short">{day.slice(0, 3)}</span>
                <span className="day-full">{day}</span>
                <span className="day-indicators">
                  {hasLunch && <span className="dot lunch" title="Lunch set">L</span>}
                  {hasDinner && <span className="dot dinner" title="Dinner set">D</span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Meal time */}
      <div className="meal-time-tabs centered">
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

      {/* Current selection status */}
      <MealProgress day={selectedDay} mealTime={selectedMealTime} />

      {/* Cuisine selector */}
      <div className="cuisine-selector">
        <h3>Choose a Cuisine</h3>
        <div className="cuisine-pills">
          {Object.values(cuisines).map((c) => (
            <button
              key={c.id}
              className={`cuisine-pill ${
                selectedCuisine === c.id ? "active" : ""
              }`}
              onClick={() => setSelectedCuisine(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes for selected cuisine */}
      {cuisine && (
        <div className="weekly-dishes">
          <h3>
            {cuisine.name} — Select Your Dishes
          </h3>
          <div className="meal-info-banner">
            Each meal = 2 Appetizers + 1 Main Course + 1 Side Dish
          </div>
          <div className="dishes-sections">
            {["appetizer", "main", "side"].map((type) => {
              const dishes = cuisine.dishes.filter((d) => d.type === type);
              return (
                <div key={type} className="dish-section">
                  <h4 className="section-label">
                    {type === "main"
                      ? "Main Course"
                      : type === "appetizer"
                      ? "Appetizers (pick 2)"
                      : "Side Dish"}
                  </h4>
                  <div className="dishes-row">
                    {dishes.map((dish) => (
                      <DishCard
                        key={dish.name}
                        dish={dish}
                        cuisineId={selectedCuisine}
                        selectedDay={selectedDay}
                        selectedMealTime={selectedMealTime}
                        compact
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function MealProgress({ day, mealTime }) {
  const { getMeal, isMealComplete } = useCart();
  const meal = getMeal(day, mealTime);
  const complete = isMealComplete(day, mealTime);

  return (
    <div className={`meal-progress ${complete ? "complete" : ""}`}>
      <h3>
        {day} {mealTime === "lunch" ? "Lunch" : "Dinner"}
      </h3>
      <div className="progress-slots">
        <div className={`slot ${meal.appetizer1 ? "filled" : ""}`}>
          <span className="slot-label">Appetizer 1</span>
          <span className="slot-value">
            {meal.appetizer1 ? meal.appetizer1.name : "Not selected"}
          </span>
        </div>
        <div className={`slot ${meal.appetizer2 ? "filled" : ""}`}>
          <span className="slot-label">Appetizer 2</span>
          <span className="slot-value">
            {meal.appetizer2 ? meal.appetizer2.name : "Not selected"}
          </span>
        </div>
        <div className={`slot ${meal.main ? "filled" : ""}`}>
          <span className="slot-label">Main Course</span>
          <span className="slot-value">
            {meal.main ? meal.main.name : "Not selected"}
          </span>
        </div>
        <div className={`slot ${meal.side ? "filled" : ""}`}>
          <span className="slot-label">Side Dish</span>
          <span className="slot-value">
            {meal.side ? meal.side.name : "Not selected"}
          </span>
        </div>
      </div>
      {complete && (
        <p className="meal-complete-msg">
          ✓ Meal complete! Move to the next day or{" "}
          <Link to="/cart">review your cart</Link>.
        </p>
      )}
    </div>
  );
}
