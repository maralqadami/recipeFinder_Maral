export default function Loading() {
  return (
    <div className="container page" aria-busy="true">
      <div className="skeleton" style={{ height: 40, width: 280, marginBottom: 24 }} />
      <div className="skeleton" style={{ height: 120, marginBottom: 28 }} />
      <div className="grid-cards">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="card">
            <div className="skeleton" style={{ aspectRatio: "4 / 3" }} />
            <div className="card-body">
              <div className="skeleton" style={{ height: 20, width: "80%" }} />
              <div className="skeleton" style={{ height: 14 }} />
              <div className="skeleton" style={{ height: 36, width: 120 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
