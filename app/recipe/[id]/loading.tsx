export default function Loading() {
  return (
    <div className="container page" aria-busy="true">
      <div className="skeleton" style={{ aspectRatio: "16 / 7", borderRadius: 24 }} />
      <div className="skeleton" style={{ height: 44, width: "60%", margin: "24px 0 12px" }} />
      <div className="skeleton" style={{ height: 20, width: "40%" }} />
    </div>
  );
}
