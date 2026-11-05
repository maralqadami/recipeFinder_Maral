"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import {
  CALORIE_LIMITS,
  CUISINES,
  DIETS,
  DISH_TYPES,
  INTOLERANCES,
  SORTS,
  TIME_LIMITS,
} from "@/lib/constants";
import { FILTER_KEYS, type Filters } from "@/lib/filters";

type Mode = "name" | "ingredients";

export default function SearchForm({
  initial = {},
  variant,
}: {
  initial?: Filters;
  variant: "hero" | "bar";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [f, setF] = useState<Filters>(initial);
  const [mode, setMode] = useState<Mode>(
    initial.ingredients && !initial.q ? "ingredients" : "name",
  );
  const [text, setText] = useState(
    initial.ingredients && !initial.q ? initial.ingredients : initial.q ?? "",
  );
  const [advanced, setAdvanced] = useState(
    Boolean(initial.intolerances || initial.maxReadyTime || initial.maxCalories),
  );

  function go(next: Filters, m: Mode = mode, t: string = text) {
    const p = new URLSearchParams();
    const trimmed = t.trim();
    if (trimmed) p.set(m === "name" ? "q" : "ingredients", trimmed);
    for (const k of FILTER_KEYS) {
      const v = next[k];
      if (v) p.set(k, v);
    }
    startTransition(() => router.push(`/search?${p.toString()}`));
  }

  function change(key: keyof Filters, value: string) {
    const next = { ...f, [key]: value || undefined };
    setF(next);
    if (variant === "bar") go(next);
  }

  const intolerances = f.intolerances ? f.intolerances.split(",") : [];
  function toggleIntolerance(name: string) {
    const set = new Set(intolerances);
    set.has(name) ? set.delete(name) : set.add(name);
    change("intolerances", [...set].join(","));
  }

  const hasFilters = FILTER_KEYS.some((k) => f[k]) || Boolean(text.trim());

  const basicSelects = (
    <>
      <label className="field">
        <span>Cuisine</span>
        <select value={f.cuisine ?? ""} onChange={(e) => change("cuisine", e.target.value)}>
          <option value="">Any cuisine</option>
          {CUISINES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Dish type</span>
        <select value={f.type ?? ""} onChange={(e) => change("type", e.target.value)}>
          <option value="">Any type</option>
          {DISH_TYPES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Diet</span>
        <select value={f.diet ?? ""} onChange={(e) => change("diet", e.target.value)}>
          <option value="">Any diet</option>
          {DIETS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Sort by</span>
        <select value={f.sort ?? ""} onChange={(e) => change("sort", e.target.value)}>
          <option value="">Most popular</option>
          {SORTS.filter((s) => s.value !== "popularity").map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
    </>
  );

  return (
    <form
      className={`search search-${variant}`}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        go(f);
      }}
    >
      <div className="search-row">
        <div className="search-input">
          <span aria-hidden className="search-icon">🔎</span>
          <input
            type="search"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              mode === "name"
                ? "Search for recipes by ingredients, cuisine, or keywords..."
                : "Type ingredients, separated by commas: tomato, cheese, basil"
            }
            aria-label="Search recipes"
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Searching…" : "Search"}
          </button>
        </div>
      </div>

      <div className="search-modes" role="radiogroup" aria-label="Search by">
        {(
          [
            ["name", "Dish name or keyword"],
            ["ingredients", "Ingredients I have"],
          ] as const
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            className={`chip ${mode === m ? "chip-on" : ""}`}
            onClick={() => setMode(m)}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          className={`chip ${advanced ? "chip-on" : ""}`}
          aria-expanded={advanced}
          onClick={() => setAdvanced((v) => !v)}
        >
          Advanced filters
        </button>
        {variant === "bar" && hasFilters && (
          <Link href="/search" className="chip chip-clear">
            Clear all
          </Link>
        )}
      </div>

      {variant === "bar" && <div className="filters-grid">{basicSelects}</div>}

      {advanced && (
        <div className="advanced">
          {variant === "hero" && <div className="filters-grid">{basicSelects}</div>}

          <div className="adv-group">
            <p className="adv-label">Quick diets</p>
            <div className="chips">
              {["vegetarian", "vegan", "gluten free", "ketogenic"].map((d) => (
                <button
                  type="button"
                  key={d}
                  className={`chip ${f.diet === d ? "chip-on" : ""}`}
                  onClick={() => change("diet", f.diet === d ? "" : d)}
                >
                  {d}
                </button>
              ))}
              {CALORIE_LIMITS.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`chip ${f.maxCalories === String(c) ? "chip-on" : ""}`}
                  onClick={() => change("maxCalories", f.maxCalories === String(c) ? "" : String(c))}
                >
                  Low calorie · under {c} kcal
                </button>
              ))}
            </div>
          </div>

          <div className="adv-group">
            <p className="adv-label">Ready in</p>
            <div className="chips">
              {TIME_LIMITS.map((t) => (
                <button
                  type="button"
                  key={t}
                  className={`chip ${f.maxReadyTime === String(t) ? "chip-on" : ""}`}
                  onClick={() => change("maxReadyTime", f.maxReadyTime === String(t) ? "" : String(t))}
                >
                  {t} min or less
                </button>
              ))}
            </div>
          </div>

          <div className="adv-group">
            <p className="adv-label">Leave out (intolerances)</p>
            <div className="chips">
              {INTOLERANCES.map((i) => (
                <button
                  type="button"
                  key={i}
                  className={`chip ${intolerances.includes(i) ? "chip-on" : ""}`}
                  aria-pressed={intolerances.includes(i)}
                  onClick={() => toggleIntolerance(i)}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {variant === "hero" && (
            <button type="submit" className="btn btn-ghost" disabled={pending}>
              Apply filters and search
            </button>
          )}
        </div>
      )}
    </form>
  );
}
