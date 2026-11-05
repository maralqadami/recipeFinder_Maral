"use client";
import { useEffect, useRef, useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const url = () => window.location.href;
  const text = `Check out this recipe: ${title}`;

  async function onShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, text, url: url() });
        return;
      } catch {
        /* cancelled — fall back to the menu */
      }
    }
    setOpen((v) => !v);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  }

  const open_ = (href: string) => window.open(href, "_blank", "noopener,noreferrer");

  return (
    <div className="share" ref={ref}>
      <button type="button" className="btn btn-ghost" onClick={onShare} aria-haspopup="menu" aria-expanded={open}>
        <span aria-hidden>↗</span> Share
      </button>
      {open && (
        <div className="share-menu" role="menu">
          <button role="menuitem" onClick={() => open_(`https://t.me/share/url?url=${encodeURIComponent(url())}&text=${encodeURIComponent(text)}`)}>
            Telegram
          </button>
          <button role="menuitem" onClick={() => open_(`https://wa.me/?text=${encodeURIComponent(text + " " + url())}`)}>
            WhatsApp
          </button>
          <button role="menuitem" onClick={() => open_(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url())}`)}>
            X (Twitter)
          </button>
          <button role="menuitem" onClick={() => open_(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`)}>
            Facebook
          </button>
          <button role="menuitem" onClick={copy}>
            {copied ? "Link copied ✓" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
