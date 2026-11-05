import type { Metadata } from "next";
import Link from "next/link";
import FavoriteButton from "@/components/FavoriteButton";
import ShareButton from "@/components/ShareButton";
import IngredientList from "@/components/IngredientList";
import ErrorBox from "@/components/ErrorBox";
import { imageSize, stripHtml, truncate } from "@/lib/format";
import { describeError, getRecipe, type RecipeDetail } from "@/lib/spoonacular";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const r = await getRecipe(params.id);
    return { title: r.title, description: truncate(stripHtml(r.summary), 160) };
  } catch {
    return { title: "Recipe" };
  }
}

export default async function RecipePage({ params }: Props) {
  let recipe: RecipeDetail;
  try {
    recipe = await getRecipe(params.id);
  } catch (e) {
    return (
      <div className="container page">
        <ErrorBox {...describeError(e)} />
        <Link href="/" className="btn btn-primary">Back to home</Link>
      </div>
    );
  }

  const steps = recipe.analyzedInstructions?.flatMap((g) => g.steps) ?? [];
  const fallbackText = steps.length === 0 ? stripHtml(recipe.instructions) : "";
  const summary = truncate(stripHtml(recipe.summary), 420);
  const flags = [
    recipe.vegetarian && "Vegetarian",
    recipe.vegan && "Vegan",
    recipe.glutenFree && "Gluten free",
    recipe.dairyFree && "Dairy free",
    recipe.veryHealthy && "Very healthy",
    recipe.cheap && "Budget friendly",
  ].filter(Boolean) as string[];

  return (
    <article className="container page detail">
      <Link href="/search" className="back">← Back to results</Link>

      <div className="detail-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSize(recipe.image, "636x393")} alt={recipe.title} />
      </div>

      <header className="detail-head">
        {(recipe.dishTypes?.length ?? 0) > 0 && (
          <div className="chips">
            {recipe.dishTypes!.slice(0, 3).map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        )}
        <h1>{recipe.title}</h1>
        <ul className="meta">
          {recipe.readyInMinutes ? <li><strong>{recipe.readyInMinutes}</strong> min</li> : null}
          {recipe.servings ? <li><strong>{recipe.servings}</strong> servings</li> : null}
          {recipe.aggregateLikes ? <li><strong>{recipe.aggregateLikes.toLocaleString()}</strong> likes</li> : null}
          {recipe.healthScore ? <li>health score <strong>{recipe.healthScore}</strong>/100</li> : null}
        </ul>
        <div className="actions">
          <FavoriteButton
            variant="large"
            recipe={{
              id: recipe.id,
              title: recipe.title,
              image: recipe.image,
              readyInMinutes: recipe.readyInMinutes,
            }}
          />
          <ShareButton title={recipe.title} />
        </div>
        {summary && <p className="lead">{summary}</p>}
      </header>

      <div className="detail-grid">
        <aside className="stack">
          <section className="panel">
            <h2>Ingredients</h2>
            {recipe.extendedIngredients?.length ? (
              <IngredientList items={recipe.extendedIngredients} />
            ) : (
              <p className="muted">No ingredient list available.</p>
            )}
          </section>

          <section className="panel">
            <h2>Good to know</h2>
            <dl className="facts">
              {recipe.readyInMinutes ? (<><dt>Cooking time</dt><dd>{recipe.readyInMinutes} minutes</dd></>) : null}
              {recipe.servings ? (<><dt>Serves</dt><dd>{recipe.servings} people</dd></>) : null}
              {recipe.pricePerServing ? (<><dt>Price per serving</dt><dd>${(recipe.pricePerServing / 100).toFixed(2)}</dd></>) : null}
              {recipe.cuisines?.length ? (<><dt>Cuisine</dt><dd>{recipe.cuisines.join(", ")}</dd></>) : null}
              {recipe.diets?.length ? (<><dt>Diets</dt><dd>{recipe.diets.join(", ")}</dd></>) : null}
            </dl>
            {flags.length > 0 && (
              <div className="chips">
                {flags.map((f) => (<span key={f} className="tag tag-green">{f}</span>))}
              </div>
            )}
            {recipe.sourceUrl && (
              <p className="source">
                Original recipe:{" "}
                <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {recipe.sourceName || "source"}
                </a>
              </p>
            )}
          </section>
        </aside>

        <section className="panel">
          <h2>Preparation steps</h2>
          {steps.length > 0 ? (
            <ol className="steps">
              {steps.map((s, i) => (
                <li key={i}>{s.step}</li>
              ))}
            </ol>
          ) : fallbackText ? (
            <p>{fallbackText}</p>
          ) : (
            <p className="muted">No instructions available. See the original recipe for details.</p>
          )}
        </section>
      </div>
    </article>
  );
}
