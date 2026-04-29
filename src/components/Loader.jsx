export default function Loader() {
  return (
    <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
      <div className="animate-spin">
        <div className="relative w-12 h-12 border-4 border-border border-t-accent rounded-full"></div>
      </div>
      <span className="sr-only">Carregando</span>
    </div>
  );
}
