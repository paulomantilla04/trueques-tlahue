export default function ProductDetailedSkeleton() {
  return (
    <div className="min-h-screen bg-[#FCF5F1] px-6 py-8 lg:px-24 xl:px-40">
      <div className="h-6 w-24 rounded-full bg-black/10 animate-pulse mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        <div className="aspect-square rounded-3xl bg-black/10 animate-pulse" />
        <div className="flex flex-col gap-4">
          <div className="h-8 w-3/4 rounded-full bg-black/10 animate-pulse" />
          <div className="h-4 w-1/3 rounded-full bg-black/10 animate-pulse" />
          <div className="h-24 w-full rounded-2xl bg-black/10 animate-pulse" />
          <div className="h-10 w-1/2 rounded-full bg-black/10 animate-pulse" />
          <div className="h-32 w-full rounded-2xl bg-black/10 animate-pulse mt-4" />
        </div>
      </div>
    </div>
  );
}