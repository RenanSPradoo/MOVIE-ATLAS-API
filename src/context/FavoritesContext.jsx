import { createContext, useCallback, useContext, useState } from 'react';

const FAV_KEY       = 'movie_favorites';
const WATCHLIST_KEY = 'movie_watchlist';

function loadList(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
}

function makeToggle(setter, key) {
  return (movie) => {
    setter((prev) => {
      const exists = prev.some((f) => f.id === movie.id);
      const next = exists ? prev.filter((f) => f.id !== movie.id) : [...prev, movie];
      localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  };
}

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites,  setFavorites]  = useState(() => loadList(FAV_KEY));
  const [watchlist,  setWatchlist]  = useState(() => loadList(WATCHLIST_KEY));

  const toggleFavorite  = useCallback(makeToggle(setFavorites, FAV_KEY),       []);
  const toggleWatchlist = useCallback(makeToggle(setWatchlist, WATCHLIST_KEY),  []);

  const isFavorite    = useCallback((id) => favorites.some((f) => f.id === id),  [favorites]);
  const isInWatchlist = useCallback((id) => watchlist.some((f) => f.id === id),  [watchlist]);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, watchlist, toggleWatchlist, isInWatchlist }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavoritesContext() {
  return useContext(FavoritesContext);
}
