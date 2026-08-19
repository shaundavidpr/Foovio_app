// DEPRECATED stub — do NOT use this local hardcoded data in production.
// The app must fetch live restaurants from Supabase. Importing this file will
// throw an explicit error to avoid accidental usage and accidental DB
// inconsistencies when orders reference fake IDs.

export default function deprecatedRestaurantsStub() {
  throw new Error(
    "Deprecated: src/data/restaurants.ts is removed. Use the Supabase-backed hooks: '@/hooks/useRestaurants' instead."
  );
}

export const restaurants = undefined as unknown as never;