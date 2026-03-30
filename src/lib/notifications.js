import { supabase, isSupabaseConfigured } from "./supabase.js";

/**
 * Send a notification email via Supabase Edge Function.
 * Sends to both customer and admin. Fails silently.
 */
async function notify(payload) {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.functions.invoke("send-notification", { body: payload });
  } catch (err) {
    console.error("Notification failed:", err);
  }
}

/** Notify on new account signup */
export function notifySignup(userName, userEmail) {
  notify({ type: "signup", userName, userEmail });
}

/** Notify on subscription activation */
export function notifySubscription(userName, userEmail, planName, planPrice) {
  notify({ type: "subscription", userName, userEmail, planName, planPrice });
}
