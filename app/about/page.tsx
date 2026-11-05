import Link from "next/link";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container page prose">
      <h1 className="page-title">About Recipe Finder</h1>
      <p className="lead">
        Recipe Finder helps you decide what to cook. Search by dish name or by the
        ingredients you already have, narrow things down by cuisine, diet, calories
        and cooking time, and keep the recipes you love in one place.
      </p>

      <div className="about-grid">
        <section className="panel">
          <h2>How it works</h2>
          <p>Search results and recipe details come from the Spoonacular API. Your API key stays on the server, so it is never exposed in the browser.</p>
        </section>
        <section className="panel">
          <h2>Your favorites</h2>
          <p>Saved recipes are stored in your browser (localStorage). They stay on this device and don't need an account.</p>
        </section>
        <section className="panel">
          <h2>Built with</h2>
          <p>Next.js (App Router), React and TypeScript, with a light and dark theme and a layout that works from phone to desktop.</p>
        </section>
      </div>

      <Link href="/" className="btn btn-primary">Start searching</Link>
    </div>
  );
}
