"use client";
import { useFavorites, type Fav } from "@/lib/favorites";

export default function FavoriteButton({
  recipe,
  variant = "icon",
}: {
  recipe: Fav;
  variant?: "icon" | "large";
}) {
  const { isFav, toggle, hydrated } = useFavorites();
  const saved = hydrated && isFav(recipe.id);

  if (variant === "large") {
    return (
      <button
        type="button"
        className={`btn btn-save ${saved ? "is-saved" : ""}`}
        aria-pressed={saved}
        onClick={() => toggle(recipe)}
      >
        <span className="heart" aria-hidden>{saved ? "♥" : "♡"}</span>
        {saved ? "Saved to favorites" : "Save to favorites"}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`fav-icon ${saved ? "is-saved" : ""}`}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${recipe.title} from favorites` : `Save ${recipe.title} to favorites`}
      onClick={() => toggle(recipe)}
    >
      <span className="heart" aria-hidden>{saved ? "♥" : "♡"}</span>
    </button>
  );
}
