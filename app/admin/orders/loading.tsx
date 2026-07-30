export default function OrdersLoading() {
  return (
    <div>
      <div className="mb-6">
        <div className="h-8 w-32 rounded bg-dark-grey animate-pulse" />
        <div className="mt-2 h-4 w-20 rounded bg-dark-grey animate-pulse" />
      </div>

      <div className="bg-dark-grey rounded-lg border border-steel-gray/20 overflow-hidden">
        <div className="border-b border-steel-gray/20 px-4 py-3">
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-4 w-20 rounded bg-steel-gray/20 animate-pulse" />
            ))}
          </div>
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b border-steel-gray/10 px-4 py-4 last:border-b-0">
            <div className="h-4 w-20 rounded bg-steel-gray/20 animate-pulse" />
            <div className="h-4 w-28 rounded bg-steel-gray/20 animate-pulse" />
            <div className="h-4 w-24 rounded bg-steel-gray/20 animate-pulse" />
            <div className="h-4 w-16 rounded bg-steel-gray/20 animate-pulse" />
            <div className="ml-auto flex gap-2">
              <div className="h-8 w-24 rounded bg-steel-gray/20 animate-pulse" />
              <div className="h-8 w-20 rounded bg-steel-gray/20 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
