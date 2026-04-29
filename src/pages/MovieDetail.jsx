import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import MovieCard from '../components/MovieCard';
import { CAST_LIMIT, IMAGE_SIZES, SIMILAR_LIMIT, getRatingColor } from '../constants/tmdb';
import { useFavoritesContext } from '../context/FavoritesContext';
import { useMovies } from '../hooks/useMovies';
import { tmdbAPI } from '../services/api';
import { getBackdropUrl, getPosterUrl, getYear } from '../utils/media';

/* ─── helpers ─────────────────────────────────────────── */

function formatRuntime(min) {
  if (!min) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

function formatCurrency(v) {
  if (!v) return null;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0,
  }).format(v);
}

function StarRating({ score }) {
  const filled = Math.round((score / 10) * 5);
  const color  = getRatingColor(score);
  return (
    <span className="flex gap-0.5" aria-label={`${score?.toFixed(1)} de 10`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} style={{ color: i < filled ? color : '#4b5563' }} className="text-xl leading-none select-none">
          ★
        </span>
      ))}
    </span>
  );
}

/* ─── Trailer fullscreen modal ────────────────────────── */

function TrailerModal({ videoKey, title, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white text-lg transition"
        aria-label="Fechar trailer"
      >
        ✕
      </button>
      <div className="w-full max-w-5xl px-4" onClick={(e) => e.stopPropagation()}>
        <iframe
          className="w-full aspect-video rounded-2xl"
          src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
          title={`Trailer — ${title}`}
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
    </div>
  );
}

/* ─── Loading skeleton ────────────────────────────────── */

function DetailSkeleton() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="h-[70vh] min-h-[480px] skeleton" />
      <div className="container mx-auto px-4 py-10 max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="h-5 skeleton rounded-full w-3/4" />
          <div className="h-4 skeleton rounded-full w-full" />
          <div className="h-4 skeleton rounded-full w-full" />
          <div className="h-4 skeleton rounded-full w-2/3" />
          <div className="h-48 skeleton rounded-2xl" />
        </div>
        <div className="h-72 skeleton rounded-2xl" />
      </div>
    </div>
  );
}

/* ─── InfoRow ─────────────────────────────────────────── */

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-muted uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-text font-medium text-sm">{value}</p>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────── */

export default function MovieDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const backdropEl = useRef(null);

  const [trailerOpen,       setTrailerOpen]       = useState(false);
  const [synopsisExpanded,  setSynopsisExpanded]  = useState(false);
  const [copied,            setCopied]            = useState(false);

  const { isFavorite, toggleFavorite, isInWatchlist, toggleWatchlist } = useFavoritesContext();

  /* Parallax */
  useEffect(() => {
    const el = backdropEl.current;
    if (!el) return;
    const onScroll = () => { el.style.transform = `translateY(${window.scrollY * 0.3}px)`; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Data fetching */
  const movieFn     = useCallback(() => tmdbAPI.getMovieDetails(id), [id]);
  const similarFn   = useCallback(() => tmdbAPI.getSimilarMovies(id), [id]);
  const providersFn = useCallback(() => tmdbAPI.getWatchProviders(id), [id]);

  const { data: movie,         loading, error } = useMovies(movieFn);
  const { data: similarData                    } = useMovies(similarFn);
  const { data: providersData                  } = useMovies(providersFn);

  /* Derived */
  const trailer = useMemo(
    () => movie?.videos?.results?.find((v) => v.type === 'Trailer' && v.site === 'YouTube'),
    [movie?.videos],
  );
  const director = useMemo(
    () => movie?.credits?.crew?.find((c) => c.job === 'Director'),
    [movie?.credits?.crew],
  );
  const brProviders     = providersData?.results?.BR;
  const streamProviders = brProviders?.flatrate || [];
  const rentProviders   = brProviders?.rent      || [];
  const similarMovies   = similarData?.results?.slice(0, SIMILAR_LIMIT) || [];

  /* Share */
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* silent */ }
  };

  /* ── render states ─────────────────────────────────── */

  if (loading) return <DetailSkeleton />;

  if (error || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🎬</p>
          <h2 className="text-2xl font-bold text-text mb-3">Filme não encontrado</h2>
          <p className="text-muted mb-6">{error}</p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-accent hover:text-accent/80 font-semibold transition"
          >
            ← Voltar
          </button>
        </div>
      </div>
    );
  }

  const backdropUrl   = getBackdropUrl(movie.backdrop_path, IMAGE_SIZES.backdrop.detail);
  const posterUrl     = getPosterUrl(movie.poster_path, IMAGE_SIZES.poster.detail);
  const ratingBg      = getRatingColor(movie.vote_average);
  const isFav         = isFavorite(movie.id);
  const inWatchlist   = isInWatchlist(movie.id);
  const overviewLong  = (movie.overview?.length || 0) > 300;

  return (
    <>
      {trailerOpen && trailer && (
        <TrailerModal videoKey={trailer.key} title={movie.title} onClose={() => setTrailerOpen(false)} />
      )}

      <div className="min-h-screen">

        {/* ══════════════════════ HERO ══════════════════════ */}
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden">

          {/* Parallax backdrop */}
          <div
            ref={backdropEl}
            className="absolute inset-0 scale-110 bg-cover bg-center will-change-transform"
            style={{ backgroundImage: `url(${backdropUrl})` }}
            role="img"
            aria-label={`Backdrop de ${movie.title}`}
          />

          {/* Overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

          {/* Back button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 z-10 flex items-center gap-2 text-white bg-black/40 hover:bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium transition"
          >
            ← Voltar
          </button>

          {/* Hero bottom content */}
          <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-10 flex items-end gap-7">

            {/* Poster */}
            <img
              src={posterUrl}
              alt={movie.title}
              className="hidden sm:block w-40 lg:w-52 rounded-2xl shadow-2xl border-2 border-white/20 flex-shrink-0 -mb-16"
              loading="eager"
              decoding="async"
            />

            {/* Title + meta */}
            <div className="flex-1 pb-1">
              {movie.tagline && (
                <p className="text-white/55 italic text-sm mb-1">{movie.tagline}</p>
              )}

              <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-3 drop-shadow-lg">
                {movie.title}
                {movie.original_title !== movie.title && (
                  <span className="block text-base sm:text-lg text-white/45 font-normal mt-1">
                    {movie.original_title}
                  </span>
                )}
              </h1>

              {/* Rating row */}
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span
                  className="px-3 py-1 rounded-full text-white text-sm font-bold shadow"
                  style={{ backgroundColor: ratingBg }}
                >
                  ★ {movie.vote_average?.toFixed(1)}
                </span>
                <StarRating score={movie.vote_average} />
                <span className="text-white/55 text-sm">
                  {movie.vote_count?.toLocaleString('pt-BR')} votos
                </span>
                <span className="text-white/55 text-sm">{getYear(movie.release_date)}</span>
                {formatRuntime(movie.runtime) && (
                  <span className="text-white/55 text-sm">{formatRuntime(movie.runtime)}</span>
                )}
              </div>

              {/* Genre badges */}
              {movie.genres?.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-5">
                  {movie.genres.map((g) => (
                    <Link
                      key={g.id}
                      to={`/genre/${g.id}`}
                      className="bg-white/10 hover:bg-accent border border-white/20 text-white px-3 py-0.5 rounded-full text-xs transition"
                    >
                      {g.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-3 flex-wrap">
                {trailer && (
                  <button
                    type="button"
                    onClick={() => setTrailerOpen(true)}
                    className="flex items-center gap-2 bg-accent hover:bg-accent/85 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition shadow-lg"
                  >
                    ▶ Assistir Trailer
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => toggleWatchlist(movie)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition border ${
                    inWatchlist
                      ? 'bg-accent/20 border-accent text-accent'
                      : 'bg-white/10 border-white/25 text-white hover:bg-white/20'
                  }`}
                >
                  {inWatchlist ? '✓ Na Watchlist' : '+ Watchlist'}
                </button>

                <button
                  type="button"
                  onClick={() => toggleFavorite(movie)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition border ${
                    isFav
                      ? 'bg-red-500/20 border-red-400 text-red-400'
                      : 'bg-white/10 border-white/25 text-white hover:bg-white/20'
                  }`}
                >
                  {isFav ? '❤️ Favoritado' : '🤍 Favoritar'}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-white/10 border border-white/25 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition"
                >
                  {copied ? '✓ Copiado!' : '↑ Compartilhar'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════ BODY ══════════════════════ */}
        <div className="container mx-auto px-4 pt-20 pb-14 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* ── Left column (2/3) ── */}
            <div className="lg:col-span-2 flex flex-col gap-10">

              {/* Synopsis */}
              {movie.overview && (
                <section>
                  <h2 className="text-xl font-bold text-text mb-3">Sinopse</h2>
                  <p className={`text-muted leading-relaxed transition-all ${!synopsisExpanded && overviewLong ? 'line-clamp-4' : ''}`}>
                    {movie.overview}
                  </p>
                  {overviewLong && (
                    <button
                      type="button"
                      onClick={() => setSynopsisExpanded((v) => !v)}
                      className="mt-2 text-accent text-sm hover:text-accent/80 font-medium transition"
                    >
                      {synopsisExpanded ? 'Ler menos ▲' : 'Ler mais... ▼'}
                    </button>
                  )}
                </section>
              )}

              {/* Cast */}
              {movie.credits?.cast?.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-text mb-4">Elenco Principal</h2>
                  <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
                    {movie.credits.cast.slice(0, CAST_LIMIT).map((actor) => (
                      <div key={actor.id} className="flex-shrink-0 w-24 snap-start text-center">
                        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-border bg-surface mb-2">
                          <img
                            src={
                              actor.profile_path
                                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                                : 'https://via.placeholder.com/80x80/111827/6b7280?text=?'
                            }
                            alt={actor.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <p className="text-text text-xs font-semibold leading-tight line-clamp-2">{actor.name}</p>
                        <p className="text-muted text-xs line-clamp-1 mt-0.5">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Trailer thumbnail → opens modal */}
              {trailer && (
                <section>
                  <h2 className="text-xl font-bold text-text mb-4">Trailer</h2>
                  <button
                    type="button"
                    onClick={() => setTrailerOpen(true)}
                    className="w-full group rounded-2xl overflow-hidden border border-border relative focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label={`Abrir trailer de ${movie.title}`}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`}
                      alt={`Thumbnail do trailer de ${movie.title}`}
                      className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition flex items-center justify-center">
                      <span className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-xl">
                        <span className="text-white text-2xl ml-1">▶</span>
                      </span>
                    </div>
                  </button>
                </section>
              )}
            </div>

            {/* ── Right column (1/3) ── */}
            <div className="flex flex-col gap-6">

              {/* Info card */}
              <section className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
                <h2 className="text-lg font-bold text-text">Informações</h2>
                <InfoRow label="Diretor"    value={director?.name} />
                <InfoRow label="Duração"    value={formatRuntime(movie.runtime)} />
                <InfoRow label="Lançamento" value={movie.release_date && new Date(movie.release_date).toLocaleDateString('pt-BR')} />
                <InfoRow label="Orçamento"  value={formatCurrency(movie.budget)} />
                <InfoRow label="Bilheteria" value={formatCurrency(movie.revenue)} />
                <InfoRow label="Produtora"  value={movie.production_companies?.[0]?.name} />
                <InfoRow label="Status"     value={movie.status} />
                <InfoRow label="Idioma"     value={movie.spoken_languages?.[0]?.name} />
              </section>

              {/* Watch providers */}
              {(streamProviders.length > 0 || rentProviders.length > 0) && (
                <section className="bg-card border border-border rounded-2xl p-5">
                  <h2 className="text-lg font-bold text-text mb-4">Onde Assistir (BR)</h2>

                  {streamProviders.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-muted uppercase tracking-widest mb-2">Streaming</p>
                      <div className="flex gap-2 flex-wrap">
                        {streamProviders.map((p) => (
                          <div key={p.provider_id} className="group flex flex-col items-center gap-1">
                            <img
                              src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                              alt={p.provider_name}
                              title={p.provider_name}
                              className="w-11 h-11 rounded-xl object-cover border border-border group-hover:border-accent transition"
                            />
                            <span className="text-muted text-xs w-12 text-center truncate">{p.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {rentProviders.length > 0 && (
                    <div>
                      <p className="text-xs text-muted uppercase tracking-widest mb-2">Aluguel</p>
                      <div className="flex gap-2 flex-wrap">
                        {rentProviders.map((p) => (
                          <div key={p.provider_id} className="group flex flex-col items-center gap-1">
                            <img
                              src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                              alt={p.provider_name}
                              title={p.provider_name}
                              className="w-11 h-11 rounded-xl object-cover border border-border group-hover:border-accent transition"
                            />
                            <span className="text-muted text-xs w-12 text-center truncate">{p.provider_name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>

          {/* ══════════════════ SIMILAR MOVIES ══════════════════ */}
          {similarMovies.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold text-text mb-6">Filmes Similares</h2>
              <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">
                {similarMovies.map((m) => (
                  <div key={m.id} className="flex-shrink-0 w-52 snap-start">
                    <MovieCard movie={m} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
