import { memo } from 'react';
import { Link } from 'react-router-dom';
import { IMAGE_SIZES, getRatingColor } from '../constants/tmdb';
import { getPosterUrl, getYear } from '../utils/media';
import { useFavoritesContext } from '../context/FavoritesContext';

function formatRuntime(min) {
  if (!min) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

function MovieCard({ movie }) {
  const posterUrl   = getPosterUrl(movie.poster_path, IMAGE_SIZES.poster.card);
  const releaseYear = getYear(movie.release_date || movie.first_air_date);
  const { toggleFavorite, isFavorite } = useFavoritesContext();
  const favorite    = isFavorite(movie.id);
  const ratingBg    = getRatingColor(movie.vote_average);
  const isDubbed    = movie.original_language && movie.original_language !== 'pt';
  const runtime     = formatRuntime(movie.runtime);

  return (
    <div className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-card hover:-translate-y-1 hover:border-accent transition-all duration-300 h-full flex flex-col">

      {/* Image */}
      <div className="relative overflow-hidden flex-shrink-0">
        <img
          src={posterUrl}
          alt={movie.title || movie.name}
          className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
        />

        {/* Top-left badges: DUB + HD */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {isDubbed && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              DUB
            </span>
          )}
          <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
            HD
          </span>
        </div>

        {/* Top-right: rating + favorite */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <span
            className="text-white text-xs font-bold px-2 py-1 rounded-full shadow-md"
            style={{ backgroundColor: ratingBg }}
          >
            ★ {movie.vote_average?.toFixed(1) || 'N/A'}
          </span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); toggleFavorite(movie); }}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm transition-transform hover:scale-110"
            aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <span className="text-xs leading-none">{favorite ? '❤️' : '🤍'}</span>
          </button>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/65 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link
            to={`/movie/${movie.id}`}
            className="bg-accent hover:bg-accent/90 text-white px-5 py-2 rounded-full text-sm font-semibold transition shadow-lg"
          >
            Ver detalhes
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-1 flex-grow">
        <Link to={`/movie/${movie.id}`} className="hover:text-accent transition-colors">
          <h3 className="text-text font-semibold text-sm leading-tight line-clamp-2">
            {movie.title || movie.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-muted text-xs mt-0.5">
          {releaseYear && <span>{releaseYear}</span>}
          {runtime && (
            <>
              <span className="w-px h-3 bg-border inline-block" />
              <span>{runtime}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(MovieCard);
