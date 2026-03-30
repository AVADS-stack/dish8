import { supabase, isSupabaseConfigured } from "./supabase.js";

/**
 * Save an order to the Supabase database.
 * Creates a row in `orders` and one row per meal in `order_items`.
 * Returns the order ID, or null if Supabase is not configured.
 */
export async function saveOrder({
  userId,
  subscriptionPlanId,
  deliveryAddress,
  items,
  totalMeals,
  mealSubtotal,
  subscriptionPrice,
  tax,
  total,
}) {
  if (!isSupabaseConfigured() || !userId) return null;

  try {
    // 1. Insert the order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        status: "confirmed",
        delivery_address: deliveryAddress,
        subscription_plan: subscriptionPlanId || null,
        total_meals: totalMeals,
        subtotal: mealSubtotal,
        subscription_cost: subscriptionPrice,
        tax,
        total,
      })
      .select("id")
      .single();

    if (orderError) throw orderError;

    // 2. Insert each meal as an order_item
    const orderItems = items.map((item) => ({
      order_id: order.id,
      day: item.day,
      meal_time: item.mealTime,
      appetizer1_name: item.appetizer1,
      appetizer1_cuisine: item.appetizer1Cuisine || "",
      appetizer2_name: item.appetizer2,
      appetizer2_cuisine: item.appetizer2Cuisine || "",
      main_name: item.main,
      main_cuisine: item.mainCuisine || "",
      side_name: item.side,
      side_cuisine: item.sideCuisine || "",
      meal_price: 9.99,
      status: "confirmed",
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order.id;
  } catch (err) {
    console.error("Failed to save order:", err);
    return null;
  }
}

/**
 * Fetch order history for the current user.
 */
export async function getOrderHistory() {
  if (!isSupabaseConfigured()) return [];

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        delivery_address,
        subscription_plan,
        total_meals,
        subtotal,
        subscription_cost,
        tax,
        total,
        created_at,
        order_items (
          day,
          meal_time,
          appetizer1_name,
          appetizer2_name,
          main_name,
          side_name,
          meal_price,
          status
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    return [];
  }
}
