export default function ErrorAlert({ title, message, hint }) {
  return (
    <div
      className="bg-accent/10 border border-accent/40 text-text p-4 mb-8 rounded-2xl"
      role="alert"
      aria-live="polite"
    >
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-muted mt-1">{message}</p>
      {hint && <div className="text-xs mt-3 text-muted">{hint}</div>}
    </div>
  );
}
