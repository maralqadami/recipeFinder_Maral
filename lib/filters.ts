export type Filters = {
  q?: string;
  ingredients?: string;
  cuisine?: string;
  diet?: string;
  type?: string;
  sort?: string;
  intolerances?: string;
  maxReadyTime?: string;
  maxCalories?: string;
};

export const FILTER_KEYS = [
  "cuisine",
  "diet",
  "type",
  "sort",
  "intolerances",
  "maxReadyTime",
  "maxCalories",
] as const;

type Raw = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v)?.trim() || undefined;

export function parseFilters(sp: Raw): Filters {
  return {
    q: one(sp.q),
    ingredients: one(sp.ingredients),
    cuisine: one(sp.cuisine),
    diet: one(sp.diet),
    type: one(sp.type),
    sort: one(sp.sort),
    intolerances: one(sp.intolerances),
    maxReadyTime: one(sp.maxReadyTime),
    maxCalories: one(sp.maxCalories),
  };
}
