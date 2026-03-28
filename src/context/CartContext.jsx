import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const MEAL_TYPES = ["lunch", "dinner"];

// Each meal = 2 appetizers + 1 main + 1 side
const COURSE_SLOTS = ["appetizer1", "appetizer2", "main", "side"];

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("d8_cart");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("d8_cart", JSON.stringify(cart));
  }, [cart]);

  // cart shape: { "Monday-lunch": { appetizer1: {...}, appetizer2: {...}, main: {...}, side: {...} }, ... }

  const getKey = (day, mealTime) => `${day}-${mealTime}`;

  const addToCart = (day, mealTime, courseType, dish, cuisineId) => {
    const key = getKey(day, mealTime);
    setCart((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [courseType]: { ...dish, cuisineId },
      },
    }));
  };

  const removeFromCart = (day, mealTime, courseType) => {
    const key = getKey(day, mealTime);
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[key]) {
        const meal = { ...updated[key] };
        delete meal[courseType];
        if (Object.keys(meal).length === 0) delete updated[key];
        else updated[key] = meal;
      }
      return updated;
    });
  };

  const clearDay = (day, mealTime) => {
    const key = getKey(day, mealTime);
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const clearCart = () => setCart({});

  const getMeal = (day, mealTime) => cart[getKey(day, mealTime)] || {};

  const isMealComplete = (day, mealTime) => {
    const meal = getMeal(day, mealTime);
    return !!(meal.appetizer1 && meal.appetizer2 && meal.main && meal.side);
  };

  const getCartSummary = () => {
    const entries = Object.entries(cart);
    const completeMeals = entries.filter(([key]) => {
      const [day, mealTime] = key.split("-");
      return isMealComplete(day, mealTime);
    });
    return {
      totalMeals: completeMeals.length,
      totalItems: entries.reduce(
        (acc, [, meal]) => acc + Object.keys(meal).length,
        0
      ),
      mealCost: 9.99,
      subtotal: completeMeals.length * 9.99,
    };
  };

  const getCartByDay = () => {
    const byDay = {};
    DAYS.forEach((day) => {
      MEAL_TYPES.forEach((mt) => {
        const meal = getMeal(day, mt);
        if (Object.keys(meal).length > 0) {
          if (!byDay[day]) byDay[day] = {};
          byDay[day][mt] = meal;
        }
      });
    });
    return byDay;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearDay,
        clearCart,
        getMeal,
        isMealComplete,
        getCartSummary,
        getCartByDay,
        DAYS,
        MEAL_TYPES,
        COURSE_SLOTS,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
