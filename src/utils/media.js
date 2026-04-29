import { FALLBACKS, TMDB_IMAGE_BASE_URL } from '../constants/tmdb';

export function buildImageUrl(path, size, fallback) {
  if (!path) {
    return fallback;
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function getYear(value) {
  if (!value) {
    return 'N/A';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return 'N/A';
  }
  return parsed.getFullYear();
}

export function getPosterUrl(path, size) {
  return buildImageUrl(path, size, FALLBACKS.poster);
}

export function getBackdropUrl(path, size) {
  return buildImageUrl(path, size, FALLBACKS.backdrop);
}

export function getProfileUrl(path, size) {
  return buildImageUrl(path, size, FALLBACKS.profile);
}
