// DEPRECATED stub — do NOT use this local hardcoded data in production.
// The app must fetch live dishes from Supabase. Importing this file will
// throw an explicit error to avoid accidental usage and accidental DB
// inconsistencies when orders reference fake IDs.

export default function deprecatedDishesStub() {
  throw new Error(
    "Deprecated: src/data/dishes.ts is removed. Use the Supabase-backed hooks: '@/hooks/useDishes' instead."
  );
}

export const dishes = undefined as unknown as never;