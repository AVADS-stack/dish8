import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ==========================================================================
// SMTP TRANSPORT
// ==========================================================================

async function sendViaSMTP(to: string, subject: string, html: string, plainText: string) {
  const smtpUser = Deno.env.get("SMTP_USER") || "";
  const smtpPass = Deno.env.get("SMTP_PASS") || "";
  const senderEmail = Deno.env.get("SENDER_EMAIL") || smtpUser;
  const senderName = Deno.env.get("SENDER_NAME") || "Dish8";

  if (!smtpUser || !smtpPass) throw new Error("SMTP not configured");

  const conn = await Deno.connectTls({ hostname: "smtp.zoho.com", port: 465 });
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  async function read(): Promise<string> {
    const buf = new Uint8Array(4096);
    const n = await conn.read(buf);
    return n ? decoder.decode(buf.subarray(0, n)).trim() : "";
  }

  async function write(cmd: string): Promise<string> {
    await conn.write(encoder.encode(cmd + "\r\n"));
    await new Promise(r => setTimeout(r, 300));
    return await read();
  }

  try {
    const greeting = await read();
    if (!greeting.startsWith("220")) throw new Error("Bad greeting: " + greeting);

    await write("EHLO dish8.com");
    await new Promise(r => setTimeout(r, 200));

    let resp = await write("AUTH LOGIN");
    if (!resp.startsWith("334")) throw new Error("AUTH failed: " + resp);

    resp = await write(btoa(smtpUser));
    if (!resp.startsWith("334")) throw new Error("Username rejected: " + resp);

    resp = await write(btoa(smtpPass));
    if (!resp.startsWith("235")) throw new Error("Password rejected: " + resp);

    resp = await write(`MAIL FROM:<${senderEmail}>`);
    resp = await write(`RCPT TO:<${to}>`);
    resp = await write("DATA");

    const boundary = "dish8_" + Date.now();
    const msg = [
      `From: ${senderName} <${senderEmail}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      ``,
      `--${boundary}`,
      `Content-Type: text/plain; charset=utf-8`,
      ``,
      plainText,
      ``,
      `--${boundary}`,
      `Content-Type: text/html; charset=utf-8`,
      ``,
      html,
      ``,
      `--${boundary}--`,
    ].join("\r\n");

    await conn.write(encoder.encode(msg + "\r\n.\r\n"));
    await new Promise(r => setTimeout(r, 500));
    await read();
    await write("QUIT");
  } finally {
    try { conn.close(); } catch {}
  }
}

// ==========================================================================
// EMAIL TEMPLATE ENGINE
// ==========================================================================

const COLORS = {
  bg: "#0f0f0f",
  card: "#1a1a1a",
  surface: "#222222",
  accent: "#e50914",
  green: "#46d369",
  orange: "#e87c03",
  blue: "#4facfe",
  purple: "#a18cd1",
  text: "#e5e5e5",
  muted: "#888888",
  border: "#2a2a2a",
};

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Dish8</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;">&nbsp;</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${COLORS.card};border-radius:16px;overflow:hidden;border:1px solid ${COLORS.border};">
          ${content}
        </table>

        <!-- Footer -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;margin-top:16px;">
          <tr>
            <td style="padding:16px 24px;text-align:center;">
              <p style="margin:0 0 8px;font-size:11px;color:${COLORS.muted};">
                &copy; ${new Date().getFullYear()} Dish8 LLC. All Rights Reserved.
              </p>
              <p style="margin:0;font-size:11px;">
                <a href="https://www.dish8.com/terms" style="color:${COLORS.muted};text-decoration:none;">Terms</a>
                &nbsp;&middot;&nbsp;
                <a href="https://www.dish8.com/refund-policy" style="color:${COLORS.muted};text-decoration:none;">Refund Policy</a>
                &nbsp;&middot;&nbsp;
                <a href="https://www.dish8.com/privacy" style="color:${COLORS.muted};text-decoration:none;">Privacy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function headerBand(title: string, subtitle: string, color: string): string {
  return `
  <tr>
    <td style="background:${color};padding:32px 24px;text-align:center;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:32px;font-weight:900;letter-spacing:-0.5px;">
              DISH<span style="font-size:38px;">8</span>
            </h1>
            ${subtitle ? `<p style="margin:8px 0 0;color:rgba(255,255,255,0.9);font-size:15px;font-weight:500;">${subtitle}</p>` : ""}
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function bodyStart(): string {
  return `<tr><td style="padding:32px 28px;">`;
}

function bodyEnd(): string {
  return `</td></tr>`;
}

function heading(text: string): string {
  return `<h2 style="margin:0 0 12px;color:#fff;font-size:22px;font-weight:700;">${text}</h2>`;
}

function paragraph(text: string): string {
  return `<p style="margin:0 0 16px;color:${COLORS.text};font-size:15px;line-height:1.65;">${text}</p>`;
}

function infoCard(rows: [string, string, string?][]): string {
  const trs = rows.map(([label, value, color]) =>
    `<tr>
      <td style="padding:8px 16px;color:${COLORS.muted};font-size:14px;border-bottom:1px solid ${COLORS.border};">${label}</td>
      <td style="padding:8px 16px;color:${color || "#fff"};font-size:14px;font-weight:600;text-align:right;border-bottom:1px solid ${COLORS.border};">${value}</td>
    </tr>`
  ).join("");
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.surface};border-radius:10px;overflow:hidden;margin:16px 0 20px;">
    ${trs}
  </table>`;
}

function ctaButton(text: string, url: string, bgColor: string = COLORS.accent, textColor: string = "#fff"): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr>
      <td align="center">
        <a href="${url}" target="_blank" style="display:inline-block;background:${bgColor};color:${textColor};padding:14px 40px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.3px;">${text}</a>
      </td>
    </tr>
  </table>`;
}

function divider(): string {
  return `<hr style="border:none;border-top:1px solid ${COLORS.border};margin:20px 0;">`;
}

function note(text: string): string {
  return `<p style="margin:16px 0 0;color:${COLORS.muted};font-size:12px;line-height:1.5;">${text}</p>`;
}

function mealTable(items: { day: string; mealTime: string; appetizer1: string; appetizer2: string; main: string; side: string }[]): string {
  const rows = items.map(item => `
    <tr>
      <td style="padding:8px 10px;color:${COLORS.text};font-size:12px;border-bottom:1px solid ${COLORS.border};">${item.day}</td>
      <td style="padding:8px 10px;color:${COLORS.text};font-size:12px;border-bottom:1px solid ${COLORS.border};">${item.mealTime === "lunch" ? "Lunch" : "Dinner"}</td>
      <td style="padding:8px 10px;color:${COLORS.text};font-size:12px;border-bottom:1px solid ${COLORS.border};">${item.appetizer1}</td>
      <td style="padding:8px 10px;color:${COLORS.text};font-size:12px;border-bottom:1px solid ${COLORS.border};">${item.appetizer2}</td>
      <td style="padding:8px 10px;color:${COLORS.text};font-size:12px;border-bottom:1px solid ${COLORS.border};">${item.main}</td>
      <td style="padding:8px 10px;color:${COLORS.text};font-size:12px;border-bottom:1px solid ${COLORS.border};">${item.side}</td>
    </tr>
  `).join("");

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.surface};border-radius:10px;overflow:hidden;margin:16px 0;">
    <thead>
      <tr style="background:#292929;">
        <th style="padding:8px 10px;text-align:left;color:${COLORS.orange};font-size:10px;text-transform:uppercase;letter-spacing:0.5px;">Day</th>
        <th style="padding:8px 10px;text-align:left;color:${COLORS.orange};font-size:10px;text-transform:uppercase;">Meal</th>
        <th style="padding:8px 10px;text-align:left;color:${COLORS.orange};font-size:10px;text-transform:uppercase;">App 1</th>
        <th style="padding:8px 10px;text-align:left;color:${COLORS.orange};font-size:10px;text-transform:uppercase;">App 2</th>
        <th style="padding:8px 10px;text-align:left;color:${COLORS.orange};font-size:10px;text-transform:uppercase;">Main</th>
        <th style="padding:8px 10px;text-align:left;color:${COLORS.orange};font-size:10px;text-transform:uppercase;">Side</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

// ==========================================================================
// EMAIL BUILDERS — one per event type
// ==========================================================================

interface EmailData {
  type: string;
  userName?: string;
  userEmail?: string;
  planName?: string;
  planPrice?: number;
  orderId?: string;
  deliveryAddress?: string;
  items?: { day: string; mealTime: string; appetizer1: string; appetizer2: string; main: string; side: string }[];
  totalMeals?: number;
  mealSubtotal?: number;
  subscriptionPrice?: number;
  tax?: number;
  total?: number;
  reason?: string;
}

function buildEmails(data: EmailData): { to: string; subject: string; html: string; text: string }[] {
  const adminEmail = Deno.env.get("ADMIN_EMAIL") || Deno.env.get("SENDER_EMAIL") || "";
  const emails: { to: string; subject: string; html: string; text: string }[] = [];
  const name = data.userName || "there";
  const ts = new Date().toLocaleString("en-US", { timeZone: "America/New_York", dateStyle: "medium", timeStyle: "short" });

  switch (data.type) {

    // ── WELCOME (after signup) ───────────────────────────────────
    case "signup":
      emails.push({
        to: data.userEmail!,
        subject: `Welcome to Dish8, ${name}!`,
        html: layout(
          headerBand("", "Welcome to Dish8!", COLORS.accent) +
          bodyStart() +
          heading(`Hi ${name}, your account is ready!`) +
          paragraph("You now have access to <strong>21+ world cuisines</strong> with <strong>800+ dishes</strong> to choose from. Here's how to get started:") +
          infoCard([
            ["Step 1", "Choose a subscription plan", COLORS.green],
            ["Step 2", "Browse cuisines & pick your meals", "#fff"],
            ["Step 3", "Get fresh food delivered!", COLORS.green],
          ]) +
          paragraph("Every meal includes <strong>2 appetizers + 1 main course + 1 side dish</strong> for just <strong>$9.99</strong> — delivery included.") +
          ctaButton("View Subscription Plans", "https://www.dish8.com/plans") +
          note("You can also browse our full menu before subscribing — explore at your own pace.") +
          bodyEnd()
        ),
        text: `Welcome to Dish8, ${name}! Your account is ready. Visit https://www.dish8.com/plans to choose a plan and start ordering.`,
      });
      if (adminEmail) {
        emails.push({
          to: adminEmail,
          subject: `[Dish8] New Signup — ${name} (${data.userEmail})`,
          html: layout(
            headerBand("", "NEW USER SIGNUP", COLORS.blue) +
            bodyStart() +
            infoCard([
              ["Name", name],
              ["Email", data.userEmail || ""],
              ["Signed Up", ts],
            ]) +
            ctaButton("View Users in Supabase", "https://supabase.com/dashboard/project/zwwyabnphogaczpgaauh/auth/users", COLORS.blue) +
            bodyEnd()
          ),
          text: `New signup: ${name} (${data.userEmail}) at ${ts}`,
        });
      }
      break;

    // ── SUBSCRIPTION ACTIVATED ───────────────────────────────────
    case "subscription":
      emails.push({
        to: data.userEmail!,
        subject: `Dish8 — ${data.planName} Plan Activated!`,
        html: layout(
          headerBand("", "Subscription Active!", COLORS.green) +
          bodyStart() +
          heading(`You're all set, ${name}!`) +
          paragraph(`Your <strong style="color:${COLORS.green};">${data.planName}</strong> subscription is now active. Start building your weekly meals today.`) +
          infoCard([
            ["Plan", data.planName || "", COLORS.green],
            ["Monthly Price", `$${(data.planPrice || 0).toFixed(2)}/mo`, COLORS.green],
            ["Per Meal", "$9.99", "#fff"],
            ["Delivery", "Included", COLORS.green],
            ["Taxes", "Calculated at checkout", COLORS.muted],
          ]) +
          ctaButton("Start Building Your Meals", "https://www.dish8.com/weekly", COLORS.green, "#000") +
          divider() +
          note("You can change or cancel your plan anytime from your dashboard. Per-meal orders can be cancelled within 24 hours of placement.") +
          bodyEnd()
        ),
        text: `Your ${data.planName} subscription ($${(data.planPrice || 0).toFixed(2)}/mo) is now active! Visit https://www.dish8.com/weekly to build your meals.`,
      });
      if (adminEmail) {
        emails.push({
          to: adminEmail,
          subject: `[Dish8] New Subscription — ${name} → ${data.planName} ($${(data.planPrice || 0).toFixed(2)}/mo)`,
          html: layout(
            headerBand("", "NEW SUBSCRIPTION", COLORS.green) +
            bodyStart() +
            infoCard([
              ["Customer", name],
              ["Email", data.userEmail || ""],
              ["Plan", data.planName || "", COLORS.green],
              ["Price", `$${(data.planPrice || 0).toFixed(2)}/mo`, COLORS.green],
              ["Time", ts],
            ]) +
            ctaButton("View in Dashboard", "https://supabase.com/dashboard/project/zwwyabnphogaczpgaauh/editor", COLORS.green, "#000") +
            bodyEnd()
          ),
          text: `New subscription: ${name} → ${data.planName} ($${(data.planPrice || 0).toFixed(2)}/mo)`,
        });
      }
      break;

    // ── ORDER PLACED ─────────────────────────────────────────────
    case "order":
      const oid = (data.orderId || "").slice(0, 8) || "N/A";
      emails.push({
        to: data.userEmail!,
        subject: `Dish8 — Order Confirmed! (${data.totalMeals} meal${(data.totalMeals || 0) !== 1 ? "s" : ""})`,
        html: layout(
          headerBand("", "Order Confirmed!", COLORS.accent) +
          bodyStart() +
          heading(`Thanks for your order, ${name}!`) +
          paragraph(`Your order <strong style="font-family:monospace;color:${COLORS.orange};">#${oid}</strong> has been confirmed and is being prepared.`) +
          infoCard([
            ["Order ID", `#${oid}`, COLORS.orange],
            ["Plan", data.planName || "—"],
            ["Subscription", `$${(data.subscriptionPrice || 0).toFixed(2)}/mo`, COLORS.accent],
            ["Meals", `${data.totalMeals} × $9.99`],
            ["Meal Subtotal", `$${(data.mealSubtotal || 0).toFixed(2)}`],
            ["Delivery", "Included", COLORS.green],
            ["Est. Tax", `$${(data.tax || 0).toFixed(2)}`],
            ["Total", `$${(data.total || 0).toFixed(2)}`, COLORS.green],
          ]) +
          (data.deliveryAddress ? `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.surface};border-radius:10px;padding:14px 16px;margin:0 0 16px;">
              <tr>
                <td>
                  <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;color:${COLORS.muted};">Delivery Address</p>
                  <p style="margin:0;color:#fff;font-size:14px;">${data.deliveryAddress}</p>
                </td>
              </tr>
            </table>` : "") +
          (data.items && data.items.length > 0 ? `
            <p style="margin:16px 0 4px;font-size:13px;font-weight:700;color:${COLORS.orange};text-transform:uppercase;letter-spacing:0.5px;">Your Meals</p>
            ${mealTable(data.items)}` : "") +
          divider() +
          paragraph("Your meals will be delivered <strong>within 24 hours</strong> of each scheduled meal time. You can cancel individual meals within 24 hours of placing the order.") +
          ctaButton("View My Orders", "https://www.dish8.com/account") +
          note("If you have questions about your order, contact us at accounts@dish8.com") +
          bodyEnd()
        ),
        text: `Order #${oid} confirmed! ${data.totalMeals} meals, $${(data.total || 0).toFixed(2)}. Delivery within 24 hours of meal time.`,
      });
      if (adminEmail) {
        emails.push({
          to: adminEmail,
          subject: `[Dish8] New Order — ${name} (${data.totalMeals} meals, $${(data.total || 0).toFixed(2)})`,
          html: layout(
            headerBand("", "NEW ORDER RECEIVED", COLORS.orange) +
            bodyStart() +
            infoCard([
              ["Order ID", `#${oid}`, COLORS.orange],
              ["Customer", name],
              ["Email", data.userEmail || ""],
              ["Address", data.deliveryAddress || "Not provided"],
              ["Plan", data.planName || "—"],
              ["Meals", `${data.totalMeals}`],
              ["Subtotal", `$${(data.mealSubtotal || 0).toFixed(2)}`],
              ["Subscription", `$${(data.subscriptionPrice || 0).toFixed(2)}/mo`],
              ["Tax", `$${(data.tax || 0).toFixed(2)}`],
              ["Total", `$${(data.total || 0).toFixed(2)}`, COLORS.green],
              ["Time", ts],
            ]) +
            (data.items && data.items.length > 0 ? mealTable(data.items) : "") +
            ctaButton("View in Dashboard", "https://supabase.com/dashboard/project/zwwyabnphogaczpgaauh/editor", COLORS.orange) +
            bodyEnd()
          ),
          text: `New order from ${name}: ${data.totalMeals} meals, $${(data.total || 0).toFixed(2)}`,
        });
      }
      break;

    // ── ORDER CANCELLED ──────────────────────────────────────────
    case "order_cancelled":
      emails.push({
        to: data.userEmail!,
        subject: `Dish8 — Order Cancelled`,
        html: layout(
          headerBand("", "Order Cancelled", COLORS.muted) +
          bodyStart() +
          heading("Your order has been cancelled") +
          paragraph(`Hi ${name}, your order <strong style="font-family:monospace;">#${(data.orderId || "").slice(0, 8)}</strong> has been cancelled as requested.`) +
          (data.reason ? paragraph(`<strong>Reason:</strong> ${data.reason}`) : "") +
          paragraph("If you paid for this order, a refund will be processed within 5-7 business days. Per our refund policy, cancellations must be made within 24 hours of order placement.") +
          ctaButton("Browse Cuisines", "https://www.dish8.com/") +
          note("Questions? Contact accounts@dish8.com") +
          bodyEnd()
        ),
        text: `Your order has been cancelled. If eligible, a refund will be processed within 5-7 business days.`,
      });
      if (adminEmail) {
        emails.push({
          to: adminEmail,
          subject: `[Dish8] Order Cancelled — ${name}`,
          html: layout(
            headerBand("", "ORDER CANCELLED", "#b00020") +
            bodyStart() +
            infoCard([
              ["Customer", name],
              ["Email", data.userEmail || ""],
              ["Order", `#${(data.orderId || "").slice(0, 8)}`],
              ["Reason", data.reason || "Customer requested"],
              ["Time", ts],
            ]) +
            bodyEnd()
          ),
          text: `Order cancelled: ${name}, #${(data.orderId || "").slice(0, 8)}`,
        });
      }
      break;

    // ── SUBSCRIPTION CANCELLED ───────────────────────────────────
    case "subscription_cancelled":
      emails.push({
        to: data.userEmail!,
        subject: `Dish8 — Subscription Cancelled`,
        html: layout(
          headerBand("", "Subscription Cancelled", COLORS.muted) +
          bodyStart() +
          heading("We're sorry to see you go") +
          paragraph(`Hi ${name}, your <strong>${data.planName}</strong> subscription has been cancelled.`) +
          paragraph("Your subscription remains active until the end of your current billing period. You can continue ordering meals until then.") +
          paragraph("You can resubscribe anytime to get back to $9.99/meal pricing with delivery included.") +
          ctaButton("Resubscribe", "https://www.dish8.com/plans") +
          note("No prorated refunds are issued for the remaining days of the current billing cycle.") +
          bodyEnd()
        ),
        text: `Your ${data.planName} subscription has been cancelled. You can resubscribe anytime at https://www.dish8.com/plans`,
      });
      if (adminEmail) {
        emails.push({
          to: adminEmail,
          subject: `[Dish8] Subscription Cancelled — ${name} (${data.planName})`,
          html: layout(
            headerBand("", "SUBSCRIPTION CANCELLED", "#b00020") +
            bodyStart() +
            infoCard([
              ["Customer", name],
              ["Email", data.userEmail || ""],
              ["Plan", data.planName || ""],
              ["Time", ts],
            ]) +
            bodyEnd()
          ),
          text: `Subscription cancelled: ${name} (${data.planName})`,
        });
      }
      break;

    // ── ORDER DELIVERED ──────────────────────────────────────────
    case "order_delivered":
      emails.push({
        to: data.userEmail!,
        subject: `Dish8 — Your Meal Has Been Delivered!`,
        html: layout(
          headerBand("", "Delivered!", COLORS.green) +
          bodyStart() +
          heading("Your meal is here!") +
          paragraph(`Hi ${name}, your order <strong style="font-family:monospace;color:${COLORS.orange};">#${(data.orderId || "").slice(0, 8)}</strong> has been delivered to your address.`) +
          (data.deliveryAddress ? paragraph(`<strong>Delivered to:</strong> ${data.deliveryAddress}`) : "") +
          paragraph("Enjoy your meal! We'd love to hear how it was.") +
          ctaButton("Order Again", "https://www.dish8.com/weekly", COLORS.green, "#000") +
          note("If there's an issue with your delivery, please report it within 12 hours at accounts@dish8.com") +
          bodyEnd()
        ),
        text: `Your order #${(data.orderId || "").slice(0, 8)} has been delivered! Enjoy your meal.`,
      });
      break;

    // ── PASSWORD RESET ───────────────────────────────────────────
    case "password_reset":
      emails.push({
        to: data.userEmail!,
        subject: `Dish8 — Reset Your Password`,
        html: layout(
          headerBand("", "Password Reset", COLORS.blue) +
          bodyStart() +
          heading("Reset your password") +
          paragraph(`Hi ${name}, we received a request to reset your Dish8 password. Click the button below to set a new one.`) +
          ctaButton("Reset Password", data.deliveryAddress || "https://www.dish8.com/auth", COLORS.blue) +
          divider() +
          note("If you didn't request this, you can safely ignore this email. Your password won't change unless you click the link above. This link expires in 24 hours.") +
          bodyEnd()
        ),
        text: `Reset your Dish8 password: ${data.deliveryAddress || "https://www.dish8.com/auth"}`,
      });
      break;
  }

  return emails;
}

// ==========================================================================
// HTTP HANDLER
// ==========================================================================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const data: EmailData = await req.json();
    const emails = buildEmails(data);

    for (const email of emails) {
      await sendViaSMTP(email.to, email.subject, email.html, email.text);
    }

    return new Response(
      JSON.stringify({ success: true, sent: emails.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
