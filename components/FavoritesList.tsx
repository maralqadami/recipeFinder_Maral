"use client";
import Link from "next/link";
import { useFavorites } from "@/lib/favorites";

export default function FavoritesList() {
  const { favorites, hydrated, remove, clear } = useFavorites();

  if (!hydrated) {
    return (
      <div className="fav-list">
        {[0, 1, 2].map((i) => (
          <div key={i} className="fav-item skeleton" style={{ height: 96 }} />
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="empty">
        <div className="empty-art" aria-hidden>🫙</div>
        <h2>No favorites yet. Start saving your favorite recipes!</h2>
        <p>Tap the heart on any recipe and it will show up here.</p>
        <Link href="/" className="btn btn-primary">Find recipes</Link>
      </div>
    );
  }

  return (
    <>
      <div className="fav-toolbar">
        <p>{favorites.length} saved {favorites.length === 1 ? "recipe" : "recipes"}</p>
        <button type="button" className="btn btn-ghost" onClick={() => confirm("Remove all favorites?") && clear()}>
          Remove all
        </button>
      </div>
      <ul className="fav-list">
        {favorites.map((r) => (
          <li key={r.id} className="fav-item">
            <Link href={`/recipe/${r.id}`} className="fav-link">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.image} alt="" width={120} height={90} loading="lazy" />
              <div>
                <h3>{r.title}</h3>
                {r.readyInMinutes ? <span className="muted">{r.readyInMinutes} min</span> : null}
              </div>
            </Link>
            <button type="button" className="btn btn-danger" onClick={() => remove(r.id)} aria-label={`Remove ${r.title}`}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
