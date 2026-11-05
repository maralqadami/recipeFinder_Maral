"use client";
import { useState } from "react";

type Ing = { id: number; original: string; name: string; image?: string };

export default function IngredientList({ items }: { items: Ing[] }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  return (
    <ul className="ingredients">
      {items.map((ing, i) => (
        <li key={`${ing.id}-${i}`}>
          <label className={checked.has(i) ? "done" : ""}>
            <input type="checkbox" checked={checked.has(i)} onChange={() => toggle(i)} />
            {ing.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://img.spoonacular.com/ingredients_100x100/${ing.image}`}
                alt=""
                width={36}
                height={36}
                loading="lazy"
              />
            ) : (
              <span className="ing-ph" aria-hidden>🥣</span>
            )}
            <span>{ing.original}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
