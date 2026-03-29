import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderItem {
  day: string;
  mealTime: string;
  appetizer1: string;
  appetizer2: string;
  main: string;
  side: string;
}

interface OrderRequest {
  userEmail: string;
  userName: string;
  planName: string;
  deliveryAddress: string;
  items: OrderItem[];
  totalMeals: number;
  mealSubtotal: number;
  subscriptionPrice: number;
  tax: number;
  total: number;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const order: OrderRequest = await req.json();

    const smtpHost = Deno.env.get("SMTP_HOST") || "smtp.zoho.com";
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "465");
    const smtpUser = Deno.env.get("SMTP_USER") || "";
    const smtpPass = Deno.env.get("SMTP_PASS") || "";
    const senderEmail = Deno.env.get("SENDER_EMAIL") || smtpUser;
    const senderName = Deno.env.get("SENDER_NAME") || "Dish8";

    if (!smtpUser || !smtpPass) {
      throw new Error("SMTP credentials not configured");
    }

    // Build meal rows for email
    const mealRows = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #333;color:#ccc;">${item.day}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #333;color:#ccc;">${item.mealTime === "lunch" ? "Lunch" : "Dinner"}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #333;color:#ccc;">${item.appetizer1}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #333;color:#ccc;">${item.appetizer2}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #333;color:#ccc;">${item.main}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #333;color:#ccc;">${item.side}</td>
        </tr>`
      )
      .join("");

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background:#141414;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:640px;margin:0 auto;background:#1c1c1c;border-radius:12px;overflow:hidden;">

        <!-- Header -->
        <div style="background:#e50914;padding:24px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:28px;font-weight:900;">
            DISH<span style="font-size:32px;">8</span>
          </h1>
          <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Your Meal, Your Way</p>
        </div>

        <!-- Body -->
        <div style="padding:32px 24px;">
          <h2 style="color:#fff;margin:0 0 8px;font-size:22px;">Order Confirmed!</h2>
          <p style="color:#999;margin:0 0 24px;font-size:15px;">
            Hi ${order.userName}, your order has been placed successfully.
          </p>

          <!-- Delivery address -->
          ${order.deliveryAddress ? `
          <div style="background:#222;border-radius:8px;padding:16px;margin-bottom:16px;">
            <h3 style="color:#fff;margin:0 0 8px;font-size:16px;">Delivery Address</h3>
            <p style="color:#ccc;margin:0;font-size:14px;">${order.deliveryAddress}</p>
          </div>
          ` : ""}

          <!-- Order summary -->
          <div style="background:#222;border-radius:8px;padding:16px;margin-bottom:24px;">
            <h3 style="color:#fff;margin:0 0 12px;font-size:16px;">Order Summary</h3>
            <table style="width:100%;font-size:14px;">
              <tr>
                <td style="padding:4px 0;color:#999;">Plan</td>
                <td style="padding:4px 0;color:#fff;text-align:right;">${order.planName}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#999;">Subscription</td>
                <td style="padding:4px 0;color:#e50914;text-align:right;">$${order.subscriptionPrice.toFixed(2)}/mo</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#999;">Meals (${order.totalMeals} × $9.99)</td>
                <td style="padding:4px 0;color:#fff;text-align:right;">$${order.mealSubtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#999;">Delivery</td>
                <td style="padding:4px 0;color:#46d369;text-align:right;">Included</td>
              </tr>
              <tr>
                <td style="padding:4px 0;color:#999;">Est. Tax</td>
                <td style="padding:4px 0;color:#fff;text-align:right;">$${order.tax.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0 0;color:#fff;font-weight:700;font-size:16px;border-top:1px solid #444;">Total</td>
                <td style="padding:8px 0 0;color:#fff;font-weight:700;font-size:16px;text-align:right;border-top:1px solid #444;">$${order.total.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <!-- Meal details -->
          <h3 style="color:#fff;margin:0 0 12px;font-size:16px;">Your Meals</h3>
          <div style="overflow-x:auto;">
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
              <thead>
                <tr style="background:#292929;">
                  <th style="padding:8px 12px;text-align:left;color:#e87c03;font-size:11px;text-transform:uppercase;">Day</th>
                  <th style="padding:8px 12px;text-align:left;color:#e87c03;font-size:11px;text-transform:uppercase;">Meal</th>
                  <th style="padding:8px 12px;text-align:left;color:#e87c03;font-size:11px;text-transform:uppercase;">Appetizer 1</th>
                  <th style="padding:8px 12px;text-align:left;color:#e87c03;font-size:11px;text-transform:uppercase;">Appetizer 2</th>
                  <th style="padding:8px 12px;text-align:left;color:#e87c03;font-size:11px;text-transform:uppercase;">Main</th>
                  <th style="padding:8px 12px;text-align:left;color:#e87c03;font-size:11px;text-transform:uppercase;">Side</th>
                </tr>
              </thead>
              <tbody>
                ${mealRows}
              </tbody>
            </table>
          </div>

          <!-- Delivery info -->
          <div style="background:#222;border-radius:8px;padding:16px;margin-top:24px;">
            <p style="color:#999;margin:0;font-size:13px;">
              Your meals will be delivered within 24 hours of each scheduled meal time.
              Orders must be placed at least 24 hours in advance.
            </p>
          </div>

          <!-- CTA -->
          <div style="text-align:center;margin-top:32px;">
            <a href="https://www.dish8.com/account"
               style="display:inline-block;background:#e50914;color:#fff;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
              View My Account
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding:20px 24px;border-top:1px solid #333;text-align:center;">
          <p style="color:#666;font-size:12px;margin:0;">
            &copy; ${new Date().getFullYear()} Dish8 LLC. All Rights Reserved.<br>
            <a href="https://www.dish8.com/terms" style="color:#666;">Terms</a> |
            <a href="https://www.dish8.com/refund-policy" style="color:#666;">Refund Policy</a> |
            <a href="https://www.dish8.com/privacy" style="color:#666;">Privacy</a>
          </p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send email via Zoho SMTP
    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: smtpPort,
        tls: true,
        auth: {
          username: smtpUser,
          password: smtpPass,
        },
      },
    });

    await client.send({
      from: `${senderName} <${senderEmail}>`,
      to: order.userEmail,
      subject: `Dish8 — Order Confirmed (${order.totalMeals} meals)`,
      content: "Your Dish8 order has been confirmed.",
      html: emailHtml,
    });

    await client.close();

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
