# Dish8 — Order Confirmation Email (Supabase Edge Function)

## Prerequisites
- Supabase CLI installed
- Zoho email account with an App Password

## Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

## Step 2: Login to Supabase

```bash
supabase login
```

This opens a browser to authenticate. Copy the token and paste it.

## Step 3: Link Your Project

```bash
cd /storage2/aveerappa/website
supabase link --project-ref zwwyabnphogaczpgaauh
```

(Your project ref is the ID from your Supabase URL)

## Step 4: Set SMTP Secrets

```bash
supabase secrets set SMTP_HOST=smtp.zoho.com
supabase secrets set SMTP_PORT=465
supabase secrets set SMTP_USER=noreply@dish8.com
supabase secrets set SMTP_PASS=your-zoho-app-password
supabase secrets set SENDER_EMAIL=noreply@dish8.com
supabase secrets set SENDER_NAME=Dish8
```

Replace `your-zoho-app-password` with the actual Zoho App Password.

To get a Zoho App Password:
1. Go to Zoho Mail → Settings → Security → App Passwords
2. Click "Generate New Password"
3. Name it "Dish8 Supabase"
4. Copy the generated password

## Step 5: Deploy the Edge Function

```bash
supabase functions deploy send-order-email --no-verify-jwt
```

The `--no-verify-jwt` flag allows the function to be called from the frontend.
For production, you should remove this flag and pass the user's JWT token.

## Step 6: Test

1. Go to www.dish8.com
2. Sign in, select a subscription, add meals, checkout
3. After order placement, check your email for the confirmation

## How It Works

1. User places order on Cart page
2. Frontend calls `sendOrderConfirmation()` which invokes the Edge Function
3. Edge Function connects to Zoho SMTP and sends a branded HTML email
4. Email includes: order summary, subscription cost, meal details table, total with tax

The email send is non-blocking — the order succeeds even if the email fails.

## Debugging

Check Edge Function logs:
```bash
supabase functions logs send-order-email
```

Or in the Supabase Dashboard → Edge Functions → send-order-email → Logs
