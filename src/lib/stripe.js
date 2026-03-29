import { loadStripe } from "@stripe/stripe-js";

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";

let stripePromise = null;

export function getStripe() {
  if (!stripePromise && stripeKey) {
    stripePromise = loadStripe(stripeKey);
  }
  return stripePromise;
}

export const isStripeConfigured = () => !!stripeKey;

/**
 * Redirect to Stripe Checkout for subscription.
 * In production, this should call your backend to create a Checkout Session.
 * For now, it creates a client-side redirect to Stripe's hosted checkout.
 *
 * IMPORTANT: For real payments, you MUST create checkout sessions server-side
 * (via Supabase Edge Function or API route) to prevent price manipulation.
 */
export async function redirectToCheckout({ priceId, userEmail, successUrl, cancelUrl }) {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error("Stripe is not configured. Add VITE_STRIPE_PUBLISHABLE_KEY to your environment.");
  }

  const { error } = await stripe.redirectToCheckout({
    lineItems: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    customerEmail: userEmail,
    successUrl: successUrl || window.location.origin + "/account?subscribed=true",
    cancelUrl: cancelUrl || window.location.origin + "/plans",
  });

  if (error) throw error;
}
