export default function MenLoading() {
  return (
    <main className="py-1">
      <div className="container-wide">
        <div className="border-steel-gray/20 border-t pt-0">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="h-8 w-48 animate-pulse rounded bg-dark-grey sm:h-10 sm:w-64" />
            <div className="flex gap-1">
              <div className="h-6 w-12 animate-pulse rounded bg-dark-grey" />
              <div className="h-6 w-14 animate-pulse rounded bg-dark-grey" />
              <div className="h-6 w-10 animate-pulse rounded bg-dark-grey" />
            </div>
          </div>
          <div className="mb-4 h-4 w-24 animate-pulse rounded bg-dark-grey" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-dark-grey aspect-[4/5] animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
