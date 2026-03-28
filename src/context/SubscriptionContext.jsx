import { createContext, useContext, useState, useEffect } from "react";

const SubscriptionContext = createContext(null);

export const PLANS = [
  {
    id: "lunch",
    name: "Lunch Only",
    price: 99.99,
    mealPrice: 9.99,
    meals: ["lunch"],
    description: "7 days of lunch every day for 30 days",
    features: [
      "2 appetizers + 1 main course + 1 side per meal",
      "Delivery included in meal price",
      "Choose from 19+ world cuisines",
      "Order for a day, week, or full month",
      "Flexible weekly menu selection",
    ],
    color: "#e50914",
    popular: false,
  },
  {
    id: "dinner",
    name: "Dinner Only",
    price: 99.99,
    mealPrice: 9.99,
    meals: ["dinner"],
    description: "7 days of dinner every day for 30 days",
    features: [
      "2 appetizers + 1 main course + 1 side per meal",
      "Delivery included in meal price",
      "Choose from 19+ world cuisines",
      "Order for a day, week, or full month",
      "Same great menu, evening delivery",
    ],
    color: "#e87c03",
    popular: false,
  },
  {
    id: "both",
    name: "Lunch & Dinner",
    price: 199.99,
    mealPrice: 9.99,
    meals: ["lunch", "dinner"],
    description: "7 days of both lunch & dinner every day for 30 days",
    features: [
      "2 appetizers + 1 main course + 1 side per meal",
      "Both lunch AND dinner daily",
      "Delivery included in meal price",
      "Choose from 19+ world cuisines",
      "Best value — 2 meals/day",
      "Maximum flexibility & savings",
    ],
    color: "#46d369",
    popular: true,
  },
];

export function SubscriptionProvider({ children }) {
  const [subscription, setSubscription] = useState(() => {
    const saved = localStorage.getItem("d8_subscription");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (subscription)
      localStorage.setItem("d8_subscription", JSON.stringify(subscription));
    else localStorage.removeItem("d8_subscription");
  }, [subscription]);

  const subscribe = (planId) => {
    const plan = PLANS.find((p) => p.id === planId);
    if (!plan) return;
    setSubscription({
      planId,
      startDate: new Date().toISOString(),
      status: "active",
    });
  };

  const cancelSubscription = () => setSubscription(null);

  const activePlan = subscription
    ? PLANS.find((p) => p.id === subscription.planId)
    : null;

  return (
    <SubscriptionContext.Provider
      value={{ subscription, activePlan, subscribe, cancelSubscription, PLANS }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => useContext(SubscriptionContext);
