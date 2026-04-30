import axios from 'axios';

const API_KEY = '22964e089ec6f3053e0372af41032d11';
const BASE_URL = 'https://api.themoviedb.org/3';
const DEFAULT_LANGUAGE = 'pt-BR';

const api = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY, language: DEFAULT_LANGUAGE },
});

const ensureApiKey = () => {
  if (!API_KEY) throw new Error('VITE_TMDB_API_KEY não configurada no .env');
};

export const tmdbAPI = {
  getPopularMovies: (page = 1) => {
    ensureApiKey();
    return api.get('/movie/popular', { params: { page } });
  },
  getTrendingMovies: () => {
    ensureApiKey();
    return api.get('/trending/movie/week');
  },
  getNowPlayingMovies: () => {
    ensureApiKey();
    return api.get('/movie/now_playing');
  },
  getTopRatedMovies: () => {
    ensureApiKey();
    return api.get('/movie/top_rated');
  },
  getMovieDetails: (id) => {
    ensureApiKey();
    return api.get(`/movie/${id}`, { params: { append_to_response: 'credits,videos' } });
  },
  getSimilarMovies: (id) => {
    ensureApiKey();
    return api.get(`/movie/${id}/similar`);
  },
  getWatchProviders: (id) => {
    ensureApiKey();
    return api.get(`/movie/${id}/watch/providers`);
  },
  getMoviesByGenre: (genreId, page = 1) => {
    ensureApiKey();
    return api.get('/discover/movie', {
      params: { with_genres: genreId, page, sort_by: 'popularity.desc' },
    });
  },
  discoverMovies: ({ genreId, year, minRating, page = 1 } = {}) => {
    ensureApiKey();
    const params = { page, sort_by: 'popularity.desc' };
    if (genreId) params.with_genres = genreId;
    if (year) params.primary_release_year = year;
    if (minRating) params['vote_average.gte'] = minRating;
    return api.get('/discover/movie', { params });
  },
  searchMovies: (query, page = 1) => {
    ensureApiKey();
    return api.get('/search/movie', { params: { query, page } });
  },
  getGenres: () => {
    ensureApiKey();
    return api.get('/genre/movie/list');
  },
};

export default api;
