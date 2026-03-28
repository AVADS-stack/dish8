# Dish8 — Supabase Backend Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up / log in
2. Click **New Project**
3. Choose your organization
4. Set project name: `dish8`
5. Set a strong database password (save it!)
6. Choose a region close to your users
7. Click **Create new project** — wait ~2 minutes

## Step 2: Get API Keys

1. Go to **Project Settings** → **API**
2. Copy these two values:
   - **Project URL** (e.g., `https://abcdefghijk.supabase.co`)
   - **anon public** key (the long `eyJ...` string)

## Step 3: Set Environment Variables

### For local development:
Create a `.env` file in the project root:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### For Vercel production:
1. Go to your Vercel project → **Settings** → **Environment Variables**
2. Add these two variables:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon public key
3. Click **Save**
4. **Redeploy** the project (Deployments → latest → Redeploy)

## Step 4: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste it in the editor
5. Click **Run** (or Cmd+Enter)
6. You should see "Success. No rows returned" — that means it worked

## Step 5: Configure Auth Settings

1. Go to **Authentication** → **Providers**
2. **Email** provider should be enabled by default
3. Under **Email** settings:
   - Enable **Confirm email** (recommended for production)
   - OR disable it for easier testing
4. Go to **Authentication** → **URL Configuration**
5. Set **Site URL** to: `https://dish8.vercel.app`
6. Add **Redirect URLs**:
   - `https://dish8.vercel.app/**`
   - `http://localhost:5173/**` (for local dev)

## Step 6: Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the **Confirm signup** template:
   - Subject: `Welcome to Dish8 — Confirm Your Email`
   - Body: Customize with your branding

## Step 7: Test

1. Restart your dev server: `npm run dev`
2. Go to `/auth` and create an account
3. Check Supabase dashboard → **Authentication** → **Users** to see the new user
4. Check **Table Editor** → **profiles** to see the profile row

## How It Works

The app automatically detects if Supabase is configured:

- **With Supabase** (`VITE_SUPABASE_URL` set): Real auth with email/password, data stored in PostgreSQL, sessions persist across devices
- **Without Supabase** (no env vars): Falls back to localStorage, works as before

This means the app works both ways — you can develop without Supabase and deploy with it.

## Database Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User name, email, address (auto-created on signup) |
| `subscriptions` | Active plan (lunch/dinner/both), status |
| `orders` | Order history with totals |
| `order_items` | Individual meals per order (day, meal time, dishes) |

All tables have Row Level Security (RLS) — users can only see their own data.

## Email Integration (Zoho)

See the separate email setup section. Supabase can send auth emails (confirmations, password resets) via its built-in email or you can configure a custom SMTP:

1. Go to **Project Settings** → **Auth** → **SMTP Settings**
2. Enable **Custom SMTP**
3. Enter your Zoho SMTP details:
   - Host: `smtp.zoho.com`
   - Port: `465`
   - Username: your Zoho email (e.g., `noreply@dish8.com`)
   - Password: your Zoho app password
   - Sender name: `Dish8`
   - Sender email: `noreply@dish8.com`
