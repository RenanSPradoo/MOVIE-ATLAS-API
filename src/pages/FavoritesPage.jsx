import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { useFavoritesContext } from '../context/FavoritesContext';

export default function FavoritesPage() {
  const { favorites } = useFavoritesContext();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <Link to="/" className="text-accent hover:text-accent/90 mb-4 inline-block text-sm">
          ← Voltar
        </Link>

        <h1 className="text-4xl font-bold text-text mb-2">Meus Favoritos</h1>
        <p className="text-muted mb-8">
          {favorites.length} filme{favorites.length !== 1 ? 's' : ''} salvo{favorites.length !== 1 ? 's' : ''}
        </p>

        {favorites.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-6">💔</p>
            <p className="text-text text-2xl font-bold mb-2">Nenhum favorito ainda</p>
            <p className="text-muted mb-8">Clique no ❤️ nos cards para salvar filmes aqui</p>
            <Link
              to="/"
              className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-full transition font-semibold"
            >
              Descobrir filmes
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
            {favorites.map((movie) => (
              <li key={movie.id} className="h-full">
                <MovieCard movie={movie} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
