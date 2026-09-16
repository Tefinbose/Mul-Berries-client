export default function Loading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-6">
      <div className="flex flex-col items-center text-center">
        {/* Spinner */}
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-900" />

        {/* Brand */}
        <p className="mt-6 text-sm font-semibold tracking-[0.25em] text-neutral-900">
          MULBERRIES
        </p>

        <p className="mt-2 text-sm text-neutral-500">
          Loading...
        </p>
      </div>
    </main>
  );
}