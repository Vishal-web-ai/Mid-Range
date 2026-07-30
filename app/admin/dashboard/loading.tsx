export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-6">
        <div className="h-8 w-48 rounded bg-dark-grey animate-pulse" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-dark-grey rounded-lg border border-steel-gray/20 p-4">
            <div className="h-4 w-20 rounded bg-steel-gray/20 animate-pulse" />
            <div className="mt-2 h-8 w-16 rounded bg-steel-gray/20 animate-pulse" />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="h-6 w-40 rounded bg-dark-grey animate-pulse mb-4" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-dark-grey rounded-lg border border-steel-gray/20 p-4">
              <div className="h-4 w-20 rounded bg-steel-gray/20 animate-pulse" />
              <div className="mt-2 h-8 w-16 rounded bg-steel-gray/20 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="h-6 w-36 rounded bg-dark-grey animate-pulse mb-4" />
        <div className="bg-dark-grey rounded-lg border border-steel-gray/20 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 border-b border-steel-gray/10 py-3 last:border-b-0">
              <div className="h-4 w-16 rounded bg-steel-gray/20 animate-pulse" />
              <div className="h-4 w-32 rounded bg-steel-gray/20 animate-pulse" />
              <div className="h-4 w-12 rounded bg-steel-gray/20 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
