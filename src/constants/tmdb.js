export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const IMAGE_SIZES = {
  poster:   { card: 'w300', detail: 'w500' },
  backdrop: { detail: 'w1280' },
  profile:  { card: 'w200' },
  logo:     { provider: 'w92' },
};

export const FALLBACKS = {
  poster:   'https://via.placeholder.com/300x450?text=No+Image',
  backdrop: 'https://via.placeholder.com/1280x720?text=No+Image',
  profile:  'https://via.placeholder.com/200x300?text=No+Image',
};

export const PAGINATION = {
  firstPage: 1,
  minPage: 1,
  maxPage: 500,
};

export const CAST_LIMIT = 12;
export const SIMILAR_LIMIT = 4;
export const SECTION_LIMIT = 8;

export function getRatingColor(score) {
  if (!score) return '#6b7280';
  if (score >= 7) return '#22c55e';
  if (score >= 5) return '#eab308';
  return '#ef4444';
}

export const GENRE_LABELS = {
  28: 'Ação', 12: 'Aventura', 16: 'Animação', 35: 'Comédia',
  80: 'Crime', 99: 'Documentário', 18: 'Drama', 10751: 'Família',
  14: 'Fantasia', 36: 'História', 27: 'Horror', 10402: 'Música',
  9648: 'Mistério', 10749: 'Romance', 878: 'Ficção Científica',
  10770: 'TV Movie', 53: 'Trailer', 10752: 'Guerra', 37: 'Faroeste',
};
