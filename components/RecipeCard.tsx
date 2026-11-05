import Link from "next/link";
import FavoriteButton from "./FavoriteButton";
import { stripHtml, truncate } from "@/lib/format";
import type { RecipeSummary } from "@/lib/spoonacular";

export default function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
  const description = truncate(stripHtml(recipe.summary), 140);
  return (
    <article className="card recipe-card">
      <div className="card-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={recipe.image} alt={recipe.title} loading="lazy" width={312} height={231} />
        <FavoriteButton
          recipe={{
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            readyInMinutes: recipe.readyInMinutes,
          }}
        />
        {recipe.readyInMinutes ? <span className="time-tag">{recipe.readyInMinutes} min</span> : null}
      </div>
      <div className="card-body">
        <h3>{recipe.title}</h3>
        {description && <p className="clamp-2">{description}</p>}
        <Link href={`/recipe/${recipe.id}`} className="btn btn-outline">
          More details
        </Link>
      </div>
    </article>
  );
}
