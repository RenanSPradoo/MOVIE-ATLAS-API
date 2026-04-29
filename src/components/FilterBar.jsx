import { useGenres } from '../hooks/useGenres';

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 35 }, (_, i) => currentYear - i);

const selectClass =
  'flex-1 min-w-36 bg-base border border-border text-text rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer';

export default function FilterBar({ filters, onChange }) {
  const genres = useGenres();
  const hasFilters = !!(filters.genreId || filters.year || filters.minRating);

  const set = (field, value) => onChange({ ...filters, [field]: value });

  return (
    <div className="bg-surface/70 border border-border rounded-2xl p-4 mb-10 flex flex-wrap gap-3 items-center">
      <select
        value={filters.genreId}
        onChange={(e) => set('genreId', e.target.value)}
        className={selectClass}
        aria-label="Filtrar por gênero"
      >
        <option value="">Todos os gêneros</option>
        {genres.map((g) => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>

      <select
        value={filters.year}
        onChange={(e) => set('year', e.target.value)}
        className={selectClass}
        aria-label="Filtrar por ano"
      >
        <option value="">Qualquer ano</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>

      <select
        value={filters.minRating}
        onChange={(e) => set('minRating', e.target.value)}
        className={selectClass}
        aria-label="Nota mínima"
      >
        <option value="">Qualquer nota</option>
        <option value="5">5+ ★</option>
        <option value="6">6+ ★</option>
        <option value="7">7+ ★</option>
        <option value="8">8+ ★</option>
      </select>

      {hasFilters && (
        <button
          type="button"
          onClick={() => onChange({ genreId: '', year: '', minRating: '' })}
          className="px-4 py-2 rounded-full border border-border text-muted hover:border-accent hover:text-text text-sm transition"
        >
          Limpar ✕
        </button>
      )}
    </div>
  );
}
