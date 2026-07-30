export default function CustomizeLoading() {
  return (
    <div className="container-storefront space-y-10">
      <div className="h-9 w-64 rounded bg-dark-grey animate-pulse" />

      <div>
        <div className="h-6 w-48 rounded bg-dark-grey animate-pulse mb-4" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-dark-grey aspect-video rounded-lg border border-steel-gray/20 animate-pulse" />
          ))}
        </div>
      </div>

      <div>
        <div className="h-6 w-40 rounded bg-dark-grey animate-pulse mb-4" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-dark-grey aspect-video rounded-lg border border-steel-gray/20 animate-pulse" />
          ))}
        </div>
      </div>

      <div>
        <div className="h-6 w-44 rounded bg-dark-grey animate-pulse mb-4" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-dark-grey h-20 rounded-lg border border-steel-gray/20 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
