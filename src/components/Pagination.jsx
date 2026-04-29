import { PAGINATION } from '../constants/tmdb';

function getPageNumbers(current, total, max = 5) {
  const capped = Math.min(total, PAGINATION.maxPage);
  if (capped <= max) return Array.from({ length: capped }, (_, i) => i + 1);
  const half = Math.floor(max / 2);
  let start = Math.max(1, current - half);
  let end = start + max - 1;
  if (end > capped) { end = capped; start = Math.max(1, end - max + 1); }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const btnNav =
  'px-4 py-2 rounded-full border border-border bg-surface text-text hover:border-accent transition disabled:opacity-40 disabled:cursor-not-allowed';
const btnPage = (active) =>
  `w-9 h-9 rounded-full border transition text-sm font-medium ${
    active
      ? 'bg-accent border-accent text-white'
      : 'bg-surface border-border text-text hover:border-accent'
  }`;

export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const cappedTotal = Math.min(totalPages, PAGINATION.maxPage);
  const isFirst = page <= PAGINATION.minPage;
  const isLast = page >= cappedTotal;
  const pages = getPageNumbers(page, totalPages);

  return (
    <nav className="flex flex-wrap justify-center items-center gap-2 mt-12" aria-label="Paginação">
      <button type="button" onClick={() => onChange(page - 1)} disabled={isFirst} className={btnNav}>
        ← Anterior
      </button>

      {pages[0] > 1 && (
        <>
          <button type="button" onClick={() => onChange(1)} className={btnPage(false)}>1</button>
          {pages[0] > 2 && <span className="text-muted px-1">…</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={btnPage(p === page)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}

      {pages[pages.length - 1] < cappedTotal && (
        <>
          {pages[pages.length - 1] < cappedTotal - 1 && <span className="text-muted px-1">…</span>}
          <button type="button" onClick={() => onChange(cappedTotal)} className={btnPage(false)}>
            {cappedTotal}
          </button>
        </>
      )}

      <button type="button" onClick={() => onChange(page + 1)} disabled={isLast} className={btnNav}>
        Próxima →
      </button>
    </nav>
  );
}
