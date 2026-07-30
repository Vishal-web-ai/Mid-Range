export default function ProductLoading() {
  return (
    <main className="py-8 sm:py-12">
      <div className="container-storefront">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="w-full lg:w-1/2">
            <div className="bg-dark-grey aspect-[4/5] w-full animate-pulse rounded-lg" />
          </div>

          <div className="flex w-full flex-col gap-4 lg:w-1/2">
            <div className="bg-dark-grey h-8 w-3/4 animate-pulse rounded" />

            <div className="flex items-center gap-3">
              <div className="bg-dark-grey h-6 w-20 animate-pulse rounded" />
              <div className="bg-dark-grey h-8 w-28 animate-pulse rounded" />
            </div>

            <div className="flex gap-3">
              <div className="bg-dark-grey h-10 w-24 animate-pulse rounded" />
              <div className="bg-dark-grey h-10 w-28 animate-pulse rounded" />
              <div className="bg-dark-grey h-10 w-20 animate-pulse rounded" />
            </div>

            <div className="bg-dark-grey h-4 w-32 animate-pulse rounded" />

            <div className="flex flex-col gap-2">
              <div className="bg-dark-grey h-4 w-full animate-pulse rounded" />
              <div className="bg-dark-grey h-4 w-5/6 animate-pulse rounded" />
              <div className="bg-dark-grey h-4 w-4/6 animate-pulse rounded" />
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <div className="bg-dark-grey h-12 w-full animate-pulse rounded" />
              <div className="bg-dark-grey h-12 w-full animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
