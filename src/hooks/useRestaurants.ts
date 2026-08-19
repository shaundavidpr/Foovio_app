import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Restaurant = {
  id: string;
  name: string;
  location?: string | null;
  rating?: number | null;
  reviews?: number | null;
  cuisine?: string | null;
  image?: string | null;
};

export default function useRestaurants(limit = 50) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("restaurants")
          .select(`id, name, location, rating, reviews, cuisine, image`)
          .limit(limit)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (mounted) setRestaurants((data ?? []) as Restaurant[]);
      } catch (e: any) {
        console.error("useRestaurants error", e);
        if (mounted) setError("Couldn't load restaurants right now.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [limit]);

  return { restaurants, loading, error, refresh: () => {} };
}
