import Link from "next/link";

export default function Pagination({
  page,
  totalPages,
  params,
}: {
  page: number;
  totalPages: number;
  params: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v && k !== "page") sp.set(k, v);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `/search?${qs}` : "/search";
  };

  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const list = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const items: (number | "gap")[] = [];
  list.forEach((p, i) => {
    if (i > 0 && p - list[i - 1] > 1) items.push("gap");
    items.push(p);
  });

  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 ? (
        <Link href={href(page - 1)} className="page-btn" rel="prev">← Previous</Link>
      ) : (
        <span className="page-btn disabled">← Previous</span>
      )}
      <div className="page-nums">
        {items.map((it, i) =>
          it === "gap" ? (
            <span key={`g${i}`} className="page-gap">…</span>
          ) : (
            <Link
              key={it}
              href={href(it)}
              className={`page-num ${it === page ? "current" : ""}`}
              aria-current={it === page ? "page" : undefined}
            >
              {it}
            </Link>
          ),
        )}
      </div>
      {page < totalPages ? (
        <Link href={href(page + 1)} className="page-btn" rel="next">Next →</Link>
      ) : (
        <span className="page-btn disabled">Next →</span>
      )}
    </nav>
  );
}
