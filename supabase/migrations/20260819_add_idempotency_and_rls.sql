-- Migration: Add idempotency key to orders and sample RLS policies
-- Run this in your Supabase SQL editor or via psql against your DB

BEGIN;

-- Add idempotency key column
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS idempotency_key text;

-- Create unique index to enforce idempotency per user
CREATE UNIQUE INDEX IF NOT EXISTS orders_user_idempotency_uq ON public.orders (user_id, idempotency_key);

-- Example Row Level Security policies
-- Enable RLS on orders and order_items
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to INSERT their own orders using Edge Functions (service role will bypass RLS)
-- For direct client inserts (if any), check that the auth.uid() matches the user_id
CREATE POLICY "users_can_insert_own_orders" ON public.orders
  FOR INSERT USING (auth.role() = 'authenticated') WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_select_own_orders" ON public.orders
  FOR SELECT USING (auth.role() = 'authenticated' AND (user_id = auth.uid()));

CREATE POLICY "users_select_order_items_for_own_orders" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "users_insert_order_items_for_own_orders" ON public.order_items
  FOR INSERT USING (auth.role() = 'authenticated') WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

COMMIT;
