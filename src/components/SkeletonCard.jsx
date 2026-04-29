export default function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border h-full" aria-hidden="true">
      <div className="w-full h-72 skeleton" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-5 skeleton rounded-full w-3/4" />
        <div className="h-3 skeleton rounded-full w-1/4" />
        <div className="h-3 skeleton rounded-full w-full" />
        <div className="h-3 skeleton rounded-full w-full" />
        <div className="h-3 skeleton rounded-full w-2/3" />
      </div>
    </div>
  );
}
