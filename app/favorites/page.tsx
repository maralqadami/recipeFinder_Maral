import FavoritesList from "@/components/FavoritesList";

export const metadata = { title: "Favorites" };

export default function FavoritesPage() {
  return (
    <div className="container page">
      <h1 className="page-title">Your favorites</h1>
      <FavoritesList />
    </div>
  );
}
