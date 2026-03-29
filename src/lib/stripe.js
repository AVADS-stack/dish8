/**
 * Stripe integration for Dish8
 *
 * Uses Stripe Payment Links for subscriptions (no server needed).
 * Uses Stripe Checkout (client-side) for per-meal payments.
 *
 * Payment Links are created in Stripe Dashboard → Payment Links.
 * Each link is a URL that redirects the customer to a Stripe-hosted checkout page.
 */

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

export const isStripeConfigured = () => !!stripeKey;

// Stripe Payment Link URLs for subscriptions (created in Stripe Dashboard)
const PAYMENT_LINKS = {
  lunch: import.meta.env.VITE_STRIPE_LINK_LUNCH || "",
  dinner: import.meta.env.VITE_STRIPE_LINK_DINNER || "",
  both: import.meta.env.VITE_STRIPE_LINK_BOTH || "",
  meal: import.meta.env.VITE_STRIPE_LINK_MEAL || "",
};

/**
 * Redirect to Stripe Payment Link for subscription.
 * Appends customer email and success URL as query params.
 */
export function redirectToSubscription(planId, userEmail) {
  const link = PAYMENT_LINKS[planId];
  if (!link) return false;

  const successUrl = encodeURIComponent(
    window.location.origin + "/weekly?subscribed=" + planId
  );
  const url = `${link}?prefilled_email=${encodeURIComponent(userEmail)}&success_url=${successUrl}`;
  window.location.href = url;
  return true;
}

/**
 * Redirect to Stripe Payment Link for meal order.
 * Quantity is passed as a query param.
 */
export function redirectToMealPayment(totalMeals, userEmail) {
  const link = PAYMENT_LINKS.meal;
  if (!link) return false;

  const successUrl = encodeURIComponent(
    window.location.origin + "/cart?order=success"
  );
  const cancelUrl = encodeURIComponent(window.location.origin + "/cart");
  const url = `${link}?prefilled_email=${encodeURIComponent(userEmail)}&quantity=${totalMeals}&success_url=${successUrl}&cancel_url=${cancelUrl}`;
  window.location.href = url;
  return true;
}
