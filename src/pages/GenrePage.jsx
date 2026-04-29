import { Link, useParams } from 'react-router-dom';
import { useCallback, useMemo, useState } from 'react';
import ErrorAlert from '../components/ErrorAlert';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';
import { GENRE_LABELS, PAGINATION } from '../constants/tmdb';
import { useMovies } from '../hooks/useMovies';
import { tmdbAPI } from '../services/api';

const SKELETON_COUNT = 8;

export default function GenrePage() {
  const { id: genreId } = useParams();
  const [page, setPage] = useState(PAGINATION.firstPage);

  const { data, loading, error } = useMovies(
    useCallback(() => tmdbAPI.getMoviesByGenre(genreId, page), [genreId, page])
  );

  const genreLabel = useMemo(
    () => GENRE_LABELS[genreId] || `Gênero ${genreId}`,
    [genreId]
  );

  const movies     = data?.results    || [];
  const totalPages = data?.total_pages || 0;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <Link to="/" className="text-accent hover:text-accent/90 mb-4 inline-block text-sm">
          ← Voltar
        </Link>

        <h1 className="text-4xl font-bold text-text mb-2">{genreLabel}</h1>
        <p className="text-muted mb-8">Filmes do gênero {genreLabel}</p>

        {error && <ErrorAlert title="Erro" message={error} />}

        {loading ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-busy="true">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => <li key={i}><SkeletonCard /></li>)}
          </ul>
        ) : movies.length > 0 ? (
          <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10" role="list">
              {movies.map((movie) => (
                <li key={movie.id} className="h-full"><MovieCard movie={movie} /></li>
              ))}
            </ul>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        ) : (
          <p className="text-text text-center py-12">Nenhum filme encontrado para este gênero.</p>
        )}
      </div>
    </div>
  );
}
