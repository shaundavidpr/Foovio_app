import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Dish = {
  id: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  price?: number | null;
  category?: string | null;
  rating?: number | null;
  restaurant_id?: string | null;
  restaurants?: { id?: string; name?: string } | null;
};

export default function useDishes(limit = 50) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("dishes")
          .select(`
            id,
            name,
            description,
            image_url,
            price,
            rating,
            category,
            restaurant_id,
            restaurants(id, name)
          `)
          .limit(limit)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (mounted) setDishes((data ?? []) as Dish[]);
      } catch (e: any) {
        console.error("useDishes error", e);
        if (mounted) setError("Couldn't load dishes right now.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [limit]);

  return { dishes, loading, error, refresh: () => {/* placeholder to call effect again */} };
}
