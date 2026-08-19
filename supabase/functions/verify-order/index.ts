// Supabase Edge Function (Deno) - verify-order
// This function receives a cart payload and returns authoritative pricing
// It must be deployed to Supabase Functions and require the SERVICE_ROLE key

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
    const items: Array<{ dish_id: string; quantity: number }> = body.items || [];
    const delivery_fee: number = Number(body.delivery_fee || 0);

    // Optional: require authenticated token for price verification to avoid abuse
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return new Response(JSON.stringify({ error: "Missing authorization token" }), { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (!supabaseUrl) {
      return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 });
    }

    const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!userRes.ok) {
      console.error("verify-order: token verify failed", await userRes.text());
      return new Response(JSON.stringify({ error: "Invalid auth token" }), { status: 401 });
    }

    // lookup dishes by id to get current prices
    const ids = items.map((i) => i.dish_id);

    const { data: dishes, error } = await supabase
      .from("dishes")
      .select("id, price")
      .in("id", ids);

    if (error) {
      console.error("verify-order: db error", error);
      return new Response(JSON.stringify({ error: "Failed to verify prices" }), { status: 500 });
    }

    // build a map for quick lookup
    const priceMap = new Map<string, number>();
    (dishes || []).forEach((d: any) => priceMap.set(d.id, Number(d.price || 0)));

    let subtotal = 0;
    const itemsWithServerPrices: any[] = [];

    for (const it of items) {
      const unit = priceMap.get(it.dish_id);
      if (unit === undefined) {
        return new Response(JSON.stringify({ error: `Dish not found: ${it.dish_id}` }), { status: 400 });
      }
      const qty = Number(it.quantity || 1);
      const itemTotal = unit * qty;
      subtotal += itemTotal;
      itemsWithServerPrices.push({ dish_id: it.dish_id, quantity: qty, unit_price: unit, item_total: itemTotal });
    }

    const total = subtotal + Number(delivery_fee || 0);

    return new Response(JSON.stringify({ valid: true, subtotal, delivery_fee, total, items: itemsWithServerPrices }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("verify-order: unexpected", err);
    return new Response(JSON.stringify({ error: "Unexpected server error" }), { status: 500 });
  }
});
