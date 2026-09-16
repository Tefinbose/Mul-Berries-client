export default function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] w-full rounded-xl bg-neutral-200" />

      <div className="mt-4 space-y-3">
        <div className="h-3 w-1/2 rounded bg-neutral-200" />

        <div className="h-4 w-3/4 rounded bg-neutral-200" />

        <div className="h-4 w-1/4 rounded bg-neutral-200" />
      </div>
    </div>
  );
}