import { useCallback, useState } from 'react';
import ErrorAlert from '../components/ErrorAlert';
import FilterBar from '../components/FilterBar';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import SkeletonCard from '../components/SkeletonCard';
import { PAGINATION, SECTION_LIMIT } from '../constants/tmdb';
import { useMovies } from '../hooks/useMovies';
import { tmdbAPI } from '../services/api';

const SKELETON_COUNT = 8;

function MovieGrid({ movies, loading }) {
  if (loading) {
    return (
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-busy="true">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <li key={i}><SkeletonCard /></li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
      {movies.map((movie) => (
        <li key={movie.id} className="h-full"><MovieCard movie={movie} /></li>
      ))}
    </ul>
  );
}

function Section({ id, title, movies, loading }) {
  return (
    <section className="mb-14" aria-labelledby={id}>
      <h2 id={id} className="text-2xl font-bold text-text mb-6">{title}</h2>
      <MovieGrid movies={movies.slice(0, SECTION_LIMIT)} loading={loading} />
    </section>
  );
}

export default function Home() {
  const [filters, setFilters] = useState({ genreId: '', year: '', minRating: '' });
  const [page, setPage] = useState(PAGINATION.firstPage);

  const hasFilters = !!(filters.genreId || filters.year || filters.minRating);

  const trendingFn   = useCallback(() => tmdbAPI.getTrendingMovies(), []);
  const nowPlayingFn = useCallback(() => tmdbAPI.getNowPlayingMovies(), []);
  const topRatedFn   = useCallback(() => tmdbAPI.getTopRatedMovies(), []);
  const discoverFn   = useCallback(
    () => tmdbAPI.discoverMovies({ ...filters, page }),
    [filters, page]
  );

  const { data: trendingData,   loading: trendingLoading,   error: trendingError }   = useMovies(hasFilters ? null : trendingFn);
  const { data: nowPlayingData, loading: nowPlayingLoading }                          = useMovies(hasFilters ? null : nowPlayingFn);
  const { data: topRatedData,   loading: topRatedLoading }                            = useMovies(hasFilters ? null : topRatedFn);
  const { data: discoverData,   loading: discoverLoading,   error: discoverError }    = useMovies(hasFilters ? discoverFn : null);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPage(PAGINATION.firstPage);
  };

  const discoverMovies     = discoverData?.results || [];
  const discoverTotalPages = discoverData?.total_pages || 0;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <header className="mb-10">
          <p className="text-muted text-sm uppercase tracking-widest">Explorar filmes</p>
          <h1 className="text-4xl font-bold text-text mt-2 mb-1">Movie Atlas</h1>
          <p className="text-muted">Descubra filmes populares, em cartaz e mais bem avaliados</p>
        </header>

        <FilterBar filters={filters} onChange={handleFiltersChange} />

        {!hasFilters ? (
          <>
            {trendingError && <ErrorAlert title="Erro" message={trendingError} />}
            <Section id="trending"   title="🔥 Trending esta semana" movies={trendingData?.results   || []} loading={trendingLoading} />
            <Section id="nowplaying" title="🎬 Em Cartaz"            movies={nowPlayingData?.results || []} loading={nowPlayingLoading} />
            <Section id="toprated"   title="⭐ Mais Bem Avaliados"   movies={topRatedData?.results   || []} loading={topRatedLoading} />
          </>
        ) : (
          <>
            {discoverError && <ErrorAlert title="Erro nos filtros" message={discoverError} />}
            {discoverLoading ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list" aria-busy="true">
                {Array.from({ length: SKELETON_COUNT }).map((_, i) => <li key={i}><SkeletonCard /></li>)}
              </ul>
            ) : discoverMovies.length > 0 ? (
              <>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10" role="list">
                  {discoverMovies.map((movie) => (
                    <li key={movie.id} className="h-full"><MovieCard movie={movie} /></li>
                  ))}
                </ul>
                <Pagination page={page} totalPages={discoverTotalPages} onChange={setPage} />
              </>
            ) : (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🎬</p>
                <p className="text-text text-xl font-semibold mb-2">Nenhum filme encontrado</p>
                <p className="text-muted">Tente ajustar os filtros acima</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
