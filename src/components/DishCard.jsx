import { useCart } from "../context/CartContext.jsx";
import { getDishImageUrl } from "../data/images.js";

const TYPE_LABELS = {
  appetizer: "Appetizer",
  main: "Main Course",
  side: "Side Dish",
};

const TYPE_COLORS = {
  appetizer: "#e87c03",
  main: "#e50914",
  side: "#46d369",
};

export default function DishCard({
  dish,
  cuisineId,
  selectedDay,
  selectedMealTime,
  compact = false,
}) {
  const { addToCart, removeFromCart, getMeal } = useCart();
  const meal = getMeal(selectedDay, selectedMealTime);

  // For appetizers, check both slots
  let cartSlot = null;
  let isInCart = false;
  if (dish.type === "appetizer") {
    if (meal.appetizer1?.name === dish.name && meal.appetizer1?.cuisineId === cuisineId) {
      cartSlot = "appetizer1";
      isInCart = true;
    } else if (meal.appetizer2?.name === dish.name && meal.appetizer2?.cuisineId === cuisineId) {
      cartSlot = "appetizer2";
      isInCart = true;
    }
  } else {
    isInCart = meal[dish.type]?.name === dish.name && meal[dish.type]?.cuisineId === cuisineId;
    cartSlot = dish.type;
  }

  const handleToggle = () => {
    if (isInCart) {
      removeFromCart(selectedDay, selectedMealTime, cartSlot);
    } else {
      if (dish.type === "appetizer") {
        // Fill first empty appetizer slot
        if (!meal.appetizer1) {
          addToCart(selectedDay, selectedMealTime, "appetizer1", dish, cuisineId);
        } else if (!meal.appetizer2) {
          addToCart(selectedDay, selectedMealTime, "appetizer2", dish, cuisineId);
        } else {
          // Both full, replace appetizer1
          addToCart(selectedDay, selectedMealTime, "appetizer1", dish, cuisineId);
        }
      } else {
        addToCart(selectedDay, selectedMealTime, dish.type, dish, cuisineId);
      }
    }
  };

  const imageUrl = getDishImageUrl(dish.name, cuisineId);

  return (
    <div className={`dish-card ${isInCart ? "in-cart" : ""} ${compact ? "compact" : ""}`}>
      <div className="dish-card-image">
        <img src={imageUrl} alt={dish.name} loading="lazy" />
        <span className="dish-type-badge" style={{ background: TYPE_COLORS[dish.type] }}>
          {TYPE_LABELS[dish.type]}
        </span>
        {isInCart && <span className="dish-check">✓</span>}
      </div>
      <div className="dish-card-body">
        <h4 className="dish-name">{dish.name}</h4>
        {!compact && <p className="dish-desc">{dish.description}</p>}
        <div className="dish-actions">
          <span className="dish-price">$9.99/meal</span>
          <button
            className={`btn-cart-toggle ${isInCart ? "remove" : "add"}`}
            onClick={handleToggle}
          >
            {isInCart ? "−  Remove" : "+  Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
