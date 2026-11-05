import Link from "next/link";
import SearchForm from "@/components/SearchForm";
import RecipeCard from "@/components/RecipeCard";
import { CUISINE_TILES } from "@/lib/constants";
import { searchRecipes, type RecipeSummary } from "@/lib/spoonacular";

export const dynamic = "force-dynamic";

async function getTrending(): Promise<RecipeSummary[]> {
  try {
    const data = await searchRecipes({ sort: "popularity" }, 1, 4, 86400);
    return data.results;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const trending = await getTrending();

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1>What's cooking today?</h1>
            <p className="hero-sub">
              Type what's in your fridge or what you're craving. We'll find recipes
              you can start on tonight.
            </p>
            <SearchForm variant="hero" />
            <div className="chips hero-quick">
              {["pasta", "chicken", "salad", "pancakes", "soup"].map((q) => (
                <Link key={q} className="chip" href={`/search?q=${q}`}>
                  {q}
                </Link>
              ))}
            </div>
          </div>

          <div className="hero-art" aria-hidden>
            <div className="rc rc-1"><span>🍅</span><i /><i /><i className="short" /></div>
            <div className="rc rc-2"><span>🥑</span><i /><i /><i className="short" /></div>
            <div className="rc rc-3"><span>🍋</span><i /><i /><i className="short" /></div>
            <div className="plate">🍝</div>
          </div>
        </div>
      </section>

      {trending.length > 0 && (
        <section className="container section">
          <div className="section-head">
            <h2>Everyone's cooking these</h2>
            <Link href="/search" className="link">See all popular recipes</Link>
          </div>
          <div className="grid-cards">
            {trending.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </section>
      )}

      <section className="container section">
        <div className="section-head">
          <h2>Cook around the world</h2>
        </div>
        <div className="tiles">
          {CUISINE_TILES.map((c) => (
            <Link key={c.name} href={`/search?cuisine=${encodeURIComponent(c.name)}`} className="tile">
              <span className="tile-emoji" aria-hidden>{c.emoji}</span>
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="diet-band">
          <div>
            <h2>Eating a certain way?</h2>
            <p>Filter by diet, calories, cooking time and intolerances.</p>
          </div>
          <div className="chips">
            {[
              ["vegetarian", "diet=vegetarian"],
              ["vegan", "diet=vegan"],
              ["gluten free", "diet=gluten%20free"],
              ["keto", "diet=ketogenic"],
              ["low calorie", "maxCalories=500"],
              ["under 30 min", "maxReadyTime=30"],
            ].map(([label, qs]) => (
              <Link key={label} href={`/search?${qs}`} className="chip">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
