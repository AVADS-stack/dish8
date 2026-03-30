import { supabase, isSupabaseConfigured } from "./supabase.js";

/**
 * Send order confirmation email via Supabase Edge Function.
 * Sends to both the customer AND the admin (accounts@dish8.com).
 * Fails silently — order still succeeds even if email fails.
 */
export async function sendOrderConfirmation({
  orderId,
  userEmail,
  userName,
  planName,
  deliveryAddress,
  items,
  totalMeals,
  mealSubtotal,
  subscriptionPrice,
  tax,
  total,
}) {
  if (!isSupabaseConfigured()) return;

  try {
    const { error } = await supabase.functions.invoke("send-order-email", {
      body: {
        orderId,
        userEmail,
        userName,
        planName,
        deliveryAddress,
        items,
        totalMeals,
        mealSubtotal,
        subscriptionPrice,
        tax,
        total,
      },
    });
    if (error) console.error("Email send failed:", error);
  } catch (err) {
    console.error("Email send failed:", err);
  }
}
