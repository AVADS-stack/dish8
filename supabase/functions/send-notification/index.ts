import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  type: "signup" | "subscription" | "order";
  // Signup fields
  userName?: string;
  userEmail?: string;
  // Subscription fields
  planName?: string;
  planPrice?: number;
  // Order fields (reuses the order email data)
  orderId?: string;
  deliveryAddress?: string;
  items?: { day: string; mealTime: string; appetizer1: string; appetizer2: string; main: string; side: string }[];
  totalMeals?: number;
  mealSubtotal?: number;
  subscriptionPrice?: number;
  tax?: number;
  total?: number;
}

function header(title: string, bgColor: string) {
  return `
    <div style="background:${bgColor};padding:24px;text-align:center;">
      <h1 style="margin:0;color:#fff;font-size:24px;font-weight:900;">
        DISH<span style="font-size:28px;">8</span>
      </h1>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:16px;font-weight:600;">${title}</p>
    </div>`;
}

function footer() {
  return `
    <div style="padding:20px 24px;border-top:1px solid #333;text-align:center;">
      <p style="color:#666;font-size:12px;margin:0;">
        &copy; ${new Date().getFullYear()} Dish8 LLC. All Rights Reserved.<br>
        <a href="https://www.dish8.com/terms" style="color:#666;">Terms</a> |
        <a href="https://www.dish8.com/refund-policy" style="color:#666;">Refund Policy</a> |
        <a href="https://www.dish8.com/privacy" style="color:#666;">Privacy</a>
      </p>
    </div>`;
}

function wrap(content: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
  <body style="margin:0;padding:0;background:#141414;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#1c1c1c;border-radius:12px;overflow:hidden;">
      ${content}
    </div>
  </body></html>`;
}

function buildSignupCustomerEmail(data: NotificationRequest) {
  return {
    subject: `Welcome to Dish8, ${data.userName}!`,
    html: wrap(`
      ${header("Welcome to Dish8!", "#e50914")}
      <div style="padding:32px 24px;">
        <h2 style="color:#fff;margin:0 0 12px;">Your account is ready!</h2>
        <p style="color:#ccc;font-size:15px;line-height:1.6;">
          Hi ${data.userName}, welcome to Dish8! You now have access to 21+ world cuisines
          with 800+ dishes to choose from.
        </p>
        <div style="background:#222;border-radius:8px;padding:16px;margin:20px 0;">
          <h3 style="color:#fff;margin:0 0 8px;font-size:15px;">What's next?</h3>
          <ol style="color:#ccc;font-size:14px;line-height:1.8;margin:0;padding-left:20px;">
            <li>Choose a subscription plan (from $99.99/mo)</li>
            <li>Browse cuisines and build your weekly meals</li>
            <li>Each meal is just $9.99 — delivery included!</li>
          </ol>
        </div>
        <div style="text-align:center;margin-top:28px;">
          <a href="https://www.dish8.com/plans" style="display:inline-block;background:#e50914;color:#fff;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
            View Subscription Plans
          </a>
        </div>
      </div>
      ${footer()}
    `),
  };
}

function buildSignupAdminEmail(data: NotificationRequest) {
  return {
    subject: `[Dish8] New Signup — ${data.userName} (${data.userEmail})`,
    html: wrap(`
      ${header("NEW USER SIGNUP", "#4facfe")}
      <div style="padding:32px 24px;">
        <div style="background:#222;border-radius:8px;padding:16px;">
          <table style="width:100%;font-size:14px;">
            <tr><td style="padding:6px 0;color:#999;">Name</td><td style="padding:6px 0;color:#fff;text-align:right;">${data.userName}</td></tr>
            <tr><td style="padding:6px 0;color:#999;">Email</td><td style="padding:6px 0;color:#fff;text-align:right;">${data.userEmail}</td></tr>
            <tr><td style="padding:6px 0;color:#999;">Time</td><td style="padding:6px 0;color:#fff;text-align:right;">${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}</td></tr>
          </table>
        </div>
        <div style="text-align:center;margin-top:24px;">
          <a href="https://supabase.com/dashboard/project/zwwyabnphogaczpgaauh/auth/users" style="display:inline-block;background:#4facfe;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">
            View in Supabase
          </a>
        </div>
      </div>
    `),
  };
}

function buildSubscriptionCustomerEmail(data: NotificationRequest) {
  return {
    subject: `Dish8 — ${data.planName} Subscription Activated!`,
    html: wrap(`
      ${header("Subscription Activated!", "#46d369")}
      <div style="padding:32px 24px;">
        <h2 style="color:#fff;margin:0 0 12px;">You're all set, ${data.userName}!</h2>
        <p style="color:#ccc;font-size:15px;line-height:1.6;">
          Your <strong style="color:#46d369;">${data.planName}</strong> plan is now active.
        </p>
        <div style="background:#222;border-radius:8px;padding:16px;margin:20px 0;">
          <table style="width:100%;font-size:14px;">
            <tr><td style="padding:6px 0;color:#999;">Plan</td><td style="padding:6px 0;color:#fff;text-align:right;font-weight:700;">${data.planName}</td></tr>
            <tr><td style="padding:6px 0;color:#999;">Monthly Price</td><td style="padding:6px 0;color:#46d369;text-align:right;font-weight:700;">$${data.planPrice?.toFixed(2)}/mo</td></tr>
            <tr><td style="padding:6px 0;color:#999;">Per Meal</td><td style="padding:6px 0;color:#fff;text-align:right;">$9.99</td></tr>
            <tr><td style="padding:6px 0;color:#999;">Delivery</td><td style="padding:6px 0;color:#46d369;text-align:right;">Included</td></tr>
          </table>
        </div>
        <p style="color:#999;font-size:13px;">
          You can cancel anytime from your dashboard. Per-meal orders can be cancelled
          within 24 hours of placement.
        </p>
        <div style="text-align:center;margin-top:28px;">
          <a href="https://www.dish8.com/weekly" style="display:inline-block;background:#46d369;color:#000;padding:14px 36px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;">
            Start Building Your Meals
          </a>
        </div>
      </div>
      ${footer()}
    `),
  };
}

function buildSubscriptionAdminEmail(data: NotificationRequest) {
  return {
    subject: `[Dish8] New Subscription — ${data.userName} → ${data.planName} ($${data.planPrice?.toFixed(2)}/mo)`,
    html: wrap(`
      ${header("NEW SUBSCRIPTION", "#46d369")}
      <div style="padding:32px 24px;">
        <div style="background:#222;border-radius:8px;padding:16px;">
          <table style="width:100%;font-size:14px;">
            <tr><td style="padding:6px 0;color:#999;">Customer</td><td style="padding:6px 0;color:#fff;text-align:right;">${data.userName}</td></tr>
            <tr><td style="padding:6px 0;color:#999;">Email</td><td style="padding:6px 0;color:#fff;text-align:right;">${data.userEmail}</td></tr>
            <tr><td style="padding:6px 0;color:#999;">Plan</td><td style="padding:6px 0;color:#46d369;text-align:right;font-weight:700;">${data.planName}</td></tr>
            <tr><td style="padding:6px 0;color:#999;">Price</td><td style="padding:6px 0;color:#46d369;text-align:right;font-weight:700;">$${data.planPrice?.toFixed(2)}/mo</td></tr>
            <tr><td style="padding:6px 0;color:#999;">Time</td><td style="padding:6px 0;color:#fff;text-align:right;">${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}</td></tr>
          </table>
        </div>
        <div style="text-align:center;margin-top:24px;">
          <a href="https://supabase.com/dashboard/project/zwwyabnphogaczpgaauh/editor" style="display:inline-block;background:#46d369;color:#000;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">
            View in Supabase
          </a>
        </div>
      </div>
    `),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const data: NotificationRequest = await req.json();

    const smtpHost = Deno.env.get("SMTP_HOST") || "smtp.zoho.com";
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "465");
    const smtpUser = Deno.env.get("SMTP_USER") || "";
    const smtpPass = Deno.env.get("SMTP_PASS") || "";
    const senderEmail = Deno.env.get("SENDER_EMAIL") || smtpUser;
    const senderName = Deno.env.get("SENDER_NAME") || "Dish8";
    const adminEmail = Deno.env.get("ADMIN_EMAIL") || senderEmail;

    if (!smtpUser || !smtpPass) {
      throw new Error("SMTP credentials not configured");
    }

    const client = new SMTPClient({
      connection: {
        hostname: smtpHost,
        port: smtpPort,
        tls: true,
        auth: { username: smtpUser, password: smtpPass },
      },
    });

    if (data.type === "signup") {
      const customerEmail = buildSignupCustomerEmail(data);
      const adminNotif = buildSignupAdminEmail(data);

      await client.send({
        from: `${senderName} <${senderEmail}>`,
        to: data.userEmail!,
        subject: customerEmail.subject,
        content: `Welcome to Dish8, ${data.userName}!`,
        html: customerEmail.html,
      });

      await client.send({
        from: `${senderName} <${senderEmail}>`,
        to: adminEmail,
        subject: adminNotif.subject,
        content: `New signup: ${data.userName} (${data.userEmail})`,
        html: adminNotif.html,
      });
    }

    if (data.type === "subscription") {
      const customerEmail = buildSubscriptionCustomerEmail(data);
      const adminNotif = buildSubscriptionAdminEmail(data);

      await client.send({
        from: `${senderName} <${senderEmail}>`,
        to: data.userEmail!,
        subject: customerEmail.subject,
        content: `Your ${data.planName} subscription is active!`,
        html: customerEmail.html,
      });

      await client.send({
        from: `${senderName} <${senderEmail}>`,
        to: adminEmail,
        subject: adminNotif.subject,
        content: `New subscription: ${data.userName} → ${data.planName}`,
        html: adminNotif.html,
      });
    }

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
