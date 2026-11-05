import SearchForm from "@/components/SearchForm";
import RecipeCard from "@/components/RecipeCard";
import Pagination from "@/components/Pagination";
import ErrorBox from "@/components/ErrorBox";
import { PAGE_SIZE } from "@/lib/constants";
import { parseFilters } from "@/lib/filters";
import { describeError, searchRecipes, type SearchResponse } from "@/lib/spoonacular";

export const metadata = { title: "Search results" };

type SP = Record<string, string | string[] | undefined>;

export default async function SearchPage({ searchParams }: { searchParams: SP }) {
  const filters = parseFilters(searchParams);
  const page = Math.max(1, Number(Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page) || 1);

  let data: SearchResponse | null = null;
  let error: { title: string; message: string } | null = null;
  try {
    data = await searchRecipes(filters, page);
  } catch (e) {
    error = describeError(e);
  }

  // Spoonacular allows offsets up to 900
  const totalPages = data ? Math.min(Math.ceil(data.totalResults / PAGE_SIZE), 75) : 0;
  const flat: Record<string, string | undefined> = { ...filters };

  const heading =
    filters.q ? `Results for “${filters.q}”` :
    filters.ingredients ? `Recipes with ${filters.ingredients}` :
    filters.cuisine ? `${filters.cuisine} recipes` :
    "Popular recipes";

  return (
    <div className="container page">
      <h1 className="page-title">{heading}</h1>
      <SearchForm key={JSON.stringify(filters)} variant="bar" initial={filters} />

      {error && <ErrorBox {...error} />}

      {data && data.results.length === 0 && (
        <div className="empty">
          <div className="empty-art" aria-hidden>🥄</div>
          <h2>No recipes match that</h2>
          <p>Try fewer ingredients, a broader keyword, or remove a filter.</p>
        </div>
      )}

      {data && data.results.length > 0 && (
        <>
          <p className="result-count">{data.totalResults.toLocaleString()} recipes found</p>
          <div className="grid-cards">
            {data.results.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} params={flat} />
        </>
      )}
    </div>
  );
}
