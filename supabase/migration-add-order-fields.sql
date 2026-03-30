-- ============================================================
-- Dish8 — Add missing columns to orders table
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- Add delivery address and subscription info to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS delivery_address TEXT,
  ADD COLUMN IF NOT EXISTS subscription_plan TEXT,
  ADD COLUMN IF NOT EXISTS subscription_cost DECIMAL(10,2) DEFAULT 0;

-- Allow the user to insert these new columns
-- (RLS policies already grant INSERT to own rows)
