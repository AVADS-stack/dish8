import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Get the user's JWT from the Authorization header
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify the user with their token
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser(token);
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unable to authenticate: " + (userError?.message || "no user") }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = user.id;

    // Use admin client (service role) to delete everything
    const admin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Get order IDs for this user
    const { data: orders } = await admin
      .from("orders")
      .select("id")
      .eq("user_id", userId);

    // 2. Delete order items if any orders exist
    if (orders && orders.length > 0) {
      const orderIds = orders.map((o: any) => o.id);
      await admin.from("order_items").delete().in("order_id", orderIds);
    }

    // 3. Delete orders
    await admin.from("orders").delete().eq("user_id", userId);

    // 4. Delete subscriptions
    await admin.from("subscriptions").delete().eq("user_id", userId);

    // 5. Delete profile
    await admin.from("profiles").delete().eq("id", userId);

    // 6. Delete the auth user
    const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
    if (deleteError) {
      return new Response(
        JSON.stringify({ error: "Failed to delete auth account: " + deleteError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
