import { useEffect, useState } from 'react';
import { tmdbAPI } from '../services/api';

export function useGenres() {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    tmdbAPI.getGenres()
      .then((res) => setGenres(res.data.genres || []))
      .catch(() => {});
  }, []);

  return genres;
}
