"use client";
import { useCallback, useSyncExternalStore } from "react";

export type Fav = {
  id: number;
  title: string;
  image: string;
  readyInMinutes?: number;
};

const KEY = "recipe-finder:favorites";
const EMPTY: Fav[] = [];
let cache: Fav[] | null = null;
const listeners = new Set<() => void>();

function read(): Fav[] {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) || "[]") as Fav[];
  } catch {
    cache = [];
  }
  return cache;
}

function write(list: Fav[]) {
  cache = list;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage full or blocked — keep in memory */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const noopSubscribe = () => () => {};

export function useFavorites() {
  const list = useSyncExternalStore(subscribe, read, () => EMPTY);
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const isFav = useCallback((id: number) => list.some((r) => r.id === id), [list]);
  const toggle = useCallback((recipe: Fav) => {
    const current = read();
    write(
      current.some((r) => r.id === recipe.id)
        ? current.filter((r) => r.id !== recipe.id)
        : [recipe, ...current],
    );
  }, []);
  const remove = useCallback((id: number) => write(read().filter((r) => r.id !== id)), []);
  const clear = useCallback(() => write([]), []);

  return { favorites: list, hydrated, isFav, toggle, remove, clear };
}
