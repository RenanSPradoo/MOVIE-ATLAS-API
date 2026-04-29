import { Link, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import ErrorAlert from '../components/ErrorAlert';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';
import { PAGINATION } from '../constants/tmdb';
import { useMovies } from '../hooks/useMovies';
import { tmdbAPI } from '../services/api';

const SKELETON_COUNT = 8;

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(PAGINATION.firstPage);
  const query = searchParams.get('q') || '';

  const apiCall = useCallback(() => tmdbAPI.searchMovies(query, page), [query, page]);
  const { data, loading, error } = useMovies(query ? apiCall : null);

  useEffect(() => { setPage(PAGINATION.firstPage); }, [query]);

  const movies     = data?.results    || [];
  const totalPages = data?.total_pages || 0;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <Link to="/" className="text-accent hover:text-accent/90 mb-4 inline-block text-sm">
          ← Voltar
        </Link>

        <h1 className="text-4xl font-bold text-text mb-2">
          {query ? `Resultados para: "${query}"` : 'Digite algo para buscar'}
        </h1>
        {!loading && query && (
          <p className="text-muted mb-8">
            {movies.length} filme{movies.length !== 1 ? 's' : ''} encontrado{movies.length !== 1 ? 's' : ''}
          </p>
        )}

        {error && <ErrorAlert title="Erro na busca" message={error} />}

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
          <div className="text-center py-20">
            {query ? (
              <>
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-text text-xl font-semibold mb-2">Nenhum resultado encontrado</p>
                <p className="text-muted">Tente buscar por outro título ou verifique a ortografia</p>
              </>
            ) : (
              <>
                <p className="text-5xl mb-4">🎬</p>
                <p className="text-text text-xl font-semibold">Digite algo para buscar filmes</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
