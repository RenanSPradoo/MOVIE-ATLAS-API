import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useId, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useGenres } from '../hooks/useGenres';
import { useFavoritesContext } from '../context/FavoritesContext';

export default function Navbar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [genreOpen, setGenreOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const genres = useGenres();
  const { favorites } = useFavoritesContext();
  const dropdownRef = useRef(null);
  const searchInputId = useId();

  useEffect(() => {
    function onClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setGenreOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav
      className="bg-surface/80 border-b border-border backdrop-blur sticky top-0 z-50"
      aria-label="Principal"
    >
      <div className="container mx-auto px-4 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Logo + mobile theme toggle */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-accent text-white grid place-items-center font-bold text-lg select-none">
              M
            </div>
            <div>
              <p className="text-xl font-bold text-text tracking-tight leading-none">Movie Atlas</p>
              <p className="text-xs text-muted">TMDb Explorer</p>
            </div>
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="lg:hidden px-3 py-1.5 rounded-full border border-border text-text text-sm"
          >
            {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
          </button>
        </div>

        {/* Links + search + theme toggle */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex items-center gap-5 flex-wrap">
            <Link to="/" className="text-text hover:text-accent transition font-medium text-sm">
              Home
            </Link>

            {/* Genres dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setGenreOpen((v) => !v)}
                className="text-text hover:text-accent transition font-medium text-sm flex items-center gap-1"
                aria-expanded={genreOpen}
                aria-haspopup="menu"
              >
                Gêneros
                <span className="text-xs opacity-60">{genreOpen ? '▲' : '▼'}</span>
              </button>

              {genreOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-52 bg-surface border border-border rounded-2xl shadow-xl py-2 z-50 max-h-72 overflow-y-auto"
                  role="menu"
                >
                  {genres.map((genre) => (
                    <Link
                      key={genre.id}
                      to={`/genre/${genre.id}`}
                      role="menuitem"
                      className="block px-4 py-2 text-sm text-text hover:text-accent hover:bg-base/60 transition"
                      onClick={() => setGenreOpen(false)}
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Favorites link */}
            <Link
              to="/favorites"
              className="text-text hover:text-accent transition font-medium text-sm flex items-center gap-1.5"
            >
              ❤️ Favoritos
              {favorites.length > 0 && (
                <span className="bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center leading-none">
                  {favorites.length > 99 ? '99+' : favorites.length}
                </span>
              )}
            </Link>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex items-center gap-2" role="search">
            <label htmlFor={searchInputId} className="sr-only">Buscar filme</label>
            <input
              id={searchInputId}
              type="text"
              placeholder="Buscar filme..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-60 px-4 py-2 rounded-full bg-base text-text placeholder-muted border border-border focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
            <button
              type="submit"
              className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-full transition text-sm"
            >
              Buscar
            </button>
          </form>

          {/* Desktop theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="hidden lg:inline-flex px-4 py-2 rounded-full border border-border text-text text-sm hover:border-accent transition"
            aria-pressed={theme === 'dark'}
          >
            {theme === 'dark' ? '☀️ Claro' : '🌙 Escuro'}
          </button>
        </div>
      </div>
    </nav>
  );
}
