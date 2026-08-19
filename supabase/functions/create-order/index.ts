// Supabase Edge Function (Deno) - create-order
// This function creates an order and its items using the service role key
// It supports idempotency via `idempotency_key` and will return the existing
// order if the same key+user_id is reused.

import { serve } from "std/server";
import { createClient } from "@supabase/supabase-js";

serve(async (req) => {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const body = await req.json();

    const {
      user_id: supplied_user_id,
      items,
      idempotency_key,
      delivery_fee = 0,
      order_type = "pickup",
      payment_method = "cash",
      delivery_address = null,
      customer_phone = null,
      notes = null,
    } = body || {};

    // Verify Authorization bearer token and derive user_id from it.
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return new Response(JSON.stringify({ error: "Missing authorization token" }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify token with Supabase Auth endpoint to extract the user id
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (!supabaseUrl) {
      return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 });
    }

    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) {
      console.error("create-order: failed to verify token", await userRes.text());
      return new Response(JSON.stringify({ error: "Invalid auth token" }), { status: 401 });
    }

    const userJson = await userRes.json();
    const user_id = userJson?.id;
    if (!user_id) {
      return new Response(JSON.stringify({ error: "Unable to determine user from token" }), { status: 401 });
    }

    if (!idempotency_key || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Idempotency check: return existing order if the key already exists for this user
    const { data: existingOrders, error: findErr } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user_id)
      .eq("idempotency_key", idempotency_key)
      .limit(1);

    if (findErr) {
      console.error("create-order: findErr", findErr);
      return new Response(JSON.stringify({ error: "Failed to check existing orders" }), { status: 500 });
    }

    if (existingOrders && existingOrders.length > 0) {
      return new Response(JSON.stringify({ success: true, idempotent: true, order: existingOrders[0] }), { status: 200 });
    }

    // Look up server-side prices to be extra safe (double-checking)
    const ids = items.map((i: any) => i.dish_id);
    const { data: dishesData, error: dishesErr } = await supabase
      .from("dishes")
      .select("id, price")
      .in("id", ids);

    if (dishesErr) {
      console.error("create-order: dishesErr", dishesErr);
      return new Response(JSON.stringify({ error: "Failed to verify dishes" }), { status: 500 });
    }

    const priceMap = new Map<string, number>();
    (dishesData || []).forEach((d: any) => priceMap.set(d.id, Number(d.price || 0)));

    let subtotal = 0;
    const itemsToInsert: any[] = [];

    for (const it of items) {
      const unit = priceMap.get(it.dish_id);
      if (unit === undefined) {
        return new Response(JSON.stringify({ error: `Dish not found: ${it.dish_id}` }), { status: 400 });
      }
      const qty = Number(it.quantity || 1);
      const itemTotal = unit * qty;
      subtotal += itemTotal;
      itemsToInsert.push({ dish_id: it.dish_id, quantity: qty, price: unit });
    }

    const total = subtotal + Number(delivery_fee || 0);

    // Create order using service role (bypass RLS). Use idempotency_key in orders table.
    const { data: orderData, error: orderErr } = await supabase
      .from("orders")
      .insert([
        {
          user_id,
          restaurant_id: items[0].restaurant_id || null,
          subtotal,
          delivery_fee,
          total,
          payment_method,
          order_type,
          delivery_address,
          customer_phone,
          notes,
          idempotency_key,
        },
      ])
      .select()
      .single();

    if (orderErr) {
      console.error("create-order: orderErr", orderErr);
      return new Response(JSON.stringify({ error: "Failed to create order" }), { status: 500 });
    }

    const order_id = orderData.id;

    const toInsert = itemsToInsert.map((it) => ({ order_id, dish_id: it.dish_id, quantity: it.quantity, price: it.price }));

    const { error: itemsInsertErr } = await supabase.from("order_items").insert(toInsert);
    if (itemsInsertErr) {
      console.error("create-order: itemsInsertErr", itemsInsertErr);
      // Try to cleanup the created order?
      return new Response(JSON.stringify({ error: "Failed to create order items" }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true, idempotent: false, order: orderData }), { status: 200 });
  } catch (err) {
    console.error("create-order: unexpected", err);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), { status: 500 });
  }
});
