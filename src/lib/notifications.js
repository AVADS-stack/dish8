import { supabase, isSupabaseConfigured } from "./supabase.js";

/**
 * Dish8 — Notification System
 * Sends branded emails via Supabase Edge Function for all user events.
 * Every notification sends to both the customer and admin (accounts@dish8.com).
 * Fails silently — app operations succeed even if email fails.
 */
function notify(payload) {
  if (!isSupabaseConfigured()) return;
  supabase.functions.invoke("send-notification", { body: payload }).catch((err) => {
    console.error("Notification failed:", err);
  });
}

/** Welcome email after signup */
export function notifySignup(userName, userEmail) {
  notify({ type: "signup", userName, userEmail });
}

/** Subscription activated */
export function notifySubscription(userName, userEmail, planName, planPrice) {
  notify({ type: "subscription", userName, userEmail, planName, planPrice });
}

/** Subscription cancelled */
export function notifySubscriptionCancelled(userName, userEmail, planName) {
  notify({ type: "subscription_cancelled", userName, userEmail, planName });
}

/** Order placed */
export function notifyOrderPlaced({
  orderId, userEmail, userName, planName, deliveryAddress,
  items, totalMeals, mealSubtotal, subscriptionPrice, tax, total,
}) {
  notify({
    type: "order", orderId, userEmail, userName, planName, deliveryAddress,
    items, totalMeals, mealSubtotal, subscriptionPrice, tax, total,
  });
}

/** Order cancelled */
export function notifyOrderCancelled(userName, userEmail, orderId, reason) {
  notify({ type: "order_cancelled", userName, userEmail, orderId, reason });
}

/** Order delivered */
export function notifyOrderDelivered(userName, userEmail, orderId, deliveryAddress) {
  notify({ type: "order_delivered", userName, userEmail, orderId, deliveryAddress });
}
