export function FeaturedProductsSkeleton() {
  return (
    <section className="px-6 lg:px-40 py-4">
      <div className="flex gap-4 h-64 sm:h-72 md:h-80 lg:h-96">

        <div className="relative flex-[1.4] md:flex-[1.6] rounded-3xl overflow-hidden bg-gray-200 animate-pulse">
          <div className="absolute bottom-4 left-4 right-4 bg-gray-300 rounded-3xl px-5 py-3 flex items-center justify-between animate-pulse">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 lg:w-44 rounded-full bg-gray-400" />
              <div className="h-3 w-14 rounded-full bg-gray-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-gray-400" />
              <div className="h-3 w-8 rounded-full bg-gray-400" />
              <div className="w-8 h-8 rounded-full bg-gray-400" />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}