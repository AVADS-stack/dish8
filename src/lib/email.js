import { supabase, isSupabaseConfigured } from "./supabase.js";

/**
 * Send order confirmation email via Supabase Edge Function.
 * Fails silently — order still succeeds even if email fails.
 */
export async function sendOrderConfirmation({
  userEmail,
  userName,
  planName,
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
        userEmail,
        userName,
        planName,
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
