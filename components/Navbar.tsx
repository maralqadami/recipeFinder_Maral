"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useFavorites } from "@/lib/favorites";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/favorites", label: "Favorites" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { favorites, hydrated } = useFavorites();

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden>🍳</span>
          Recipe Finder
        </Link>

        <nav className={`nav-links ${open ? "open" : ""}`} aria-label="Main">
          {LINKS.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={active ? "active" : ""}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {l.label}
                {l.href === "/favorites" && hydrated && favorites.length > 0 && (
                  <span className="count">{favorites.length}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="nav-actions">
          <ThemeToggle />
          <button
            type="button"
            className="icon-btn menu-btn"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden>{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
