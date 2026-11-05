import "server-only";
import { PAGE_SIZE } from "./constants";
import type { Filters } from "./filters";

const BASE = "https://api.spoonacular.com";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export type RecipeSummary = {
  id: number;
  title: string;
  image: string;
  summary?: string;
  readyInMinutes?: number;
  servings?: number;
  healthScore?: number;
  aggregateLikes?: number;
  diets?: string[];
  dishTypes?: string[];
};

export type SearchResponse = {
  results: RecipeSummary[];
  offset: number;
  number: number;
  totalResults: number;
};

export type RecipeDetail = RecipeSummary & {
  instructions?: string;
  analyzedInstructions?: { steps: { number: number; step: string }[] }[];
  extendedIngredients?: {
    id: number;
    original: string;
    name: string;
    image?: string;
  }[];
  cuisines?: string[];
  pricePerServing?: number;
  sourceName?: string;
  sourceUrl?: string;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  veryHealthy?: boolean;
  cheap?: boolean;
};

async function request<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined>,
  revalidate = 3600,
): Promise<T> {
  const key = process.env.SPOONACULAR_API_KEY;
  if (!key) throw new ApiError("MISSING_KEY", 401);

  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  url.searchParams.set("apiKey", key);

  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) throw new ApiError(res.statusText, res.status);
  return res.json() as Promise<T>;
}

export function searchRecipes(
  f: Filters,
  page = 1,
  pageSize = PAGE_SIZE,
  revalidate = 3600,
) {
  const ascending = f.sort === "time" || f.sort === "price";
  return request<SearchResponse>(
    "/recipes/complexSearch",
    {
      query: f.q,
      includeIngredients: f.ingredients,
      cuisine: f.cuisine,
      diet: f.diet,
      type: f.type,
      intolerances: f.intolerances,
      maxReadyTime: f.maxReadyTime,
      maxCalories: f.maxCalories,
      sort: f.sort || "popularity",
      sortDirection: ascending ? "asc" : "desc",
      number: pageSize,
      offset: (page - 1) * pageSize,
      addRecipeInformation: true,
    },
    revalidate,
  );
}

export function getRecipe(id: string) {
  return request<RecipeDetail>(
    `/recipes/${encodeURIComponent(id)}/information`,
    { includeNutrition: false },
    86400,
  );
}

export function describeError(e: unknown): { title: string; message: string } {
  const status = e instanceof ApiError ? e.status : 0;
  if (e instanceof ApiError && e.message === "MISSING_KEY")
    return {
      title: "API key not set",
      message:
        "Create a .env.local file with SPOONACULAR_API_KEY=your_key, then restart the dev server.",
    };
  if (status === 401 || status === 403)
    return {
      title: "The API key was rejected",
      message: "Check SPOONACULAR_API_KEY in .env.local and make sure it is correct.",
    };
  if (status === 402 || status === 429)
    return {
      title: "Daily API limit reached",
      message:
        "The free Spoonacular plan has a daily quota. Try again tomorrow or use another key.",
    };
  if (status === 404)
    return { title: "Recipe not found", message: "That recipe doesn't exist anymore." };
  return {
    title: "Couldn't load recipes",
    message: "Something went wrong while contacting Spoonacular. Please try again.",
  };
}
