export default function PageHeader({ eyebrow, title, description, stats }) {
  return (
    <section className="bg-surface/70 border border-border rounded-3xl p-8 mb-10" aria-labelledby="page-title">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          {eyebrow && (
            <p className="text-muted text-sm uppercase tracking-widest">{eyebrow}</p>
          )}
          <h1 id="page-title" className="text-4xl font-bold text-text mt-2">
            {title}
          </h1>
          {description && <p className="text-muted mt-2">{description}</p>}
        </div>
        {stats && <div className="flex gap-3">{stats}</div>}
      </div>
    </section>
  );
}
