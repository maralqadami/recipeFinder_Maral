import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container page">
      <div className="empty">
        <div className="empty-art" aria-hidden>🍽️</div>
        <h1>This page isn't on the menu</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link href="/" className="btn btn-primary">Back to home</Link>
      </div>
    </div>
  );
}
