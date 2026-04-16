import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

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

    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Not authenticated" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Verify user by calling auth/v1/user with their token
    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: supabaseAnonKey,
      },
    });

    if (!userRes.ok) {
      const errText = await userRes.text();
      return new Response(
        JSON.stringify({ error: "Authentication failed: " + errText }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const user = await userRes.json();
    const userId = user.id;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "No user ID in token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const adminHeaders = {
      apikey: supabaseServiceKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
      "Content-Type": "application/json",
    };

    // 2. Get user's order IDs
    const ordersRes = await fetch(
      `${supabaseUrl}/rest/v1/orders?user_id=eq.${userId}&select=id`,
      { headers: adminHeaders }
    );
    const orders = ordersRes.ok ? await ordersRes.json() : [];

    // 3. Delete order_items for those orders
    if (orders.length > 0) {
      const orderIds = orders.map((o: any) => o.id).join(",");
      await fetch(
        `${supabaseUrl}/rest/v1/order_items?order_id=in.(${orderIds})`,
        { method: "DELETE", headers: adminHeaders }
      );
    }

    // 4. Delete orders
    await fetch(
      `${supabaseUrl}/rest/v1/orders?user_id=eq.${userId}`,
      { method: "DELETE", headers: adminHeaders }
    );

    // 5. Delete subscriptions
    await fetch(
      `${supabaseUrl}/rest/v1/subscriptions?user_id=eq.${userId}`,
      { method: "DELETE", headers: adminHeaders }
    );

    // 6. Delete profile
    await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`,
      { method: "DELETE", headers: adminHeaders }
    );

    // 7. Delete auth user via admin API
    const deleteRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users/${userId}`,
      {
        method: "DELETE",
        headers: {
          apikey: supabaseServiceKey,
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
      }
    );

    if (!deleteRes.ok) {
      const errText = await deleteRes.text();
      return new Response(
        JSON.stringify({ error: "Failed to delete auth user: " + errText }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, userId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error", stack: error.stack }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
