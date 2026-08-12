export default function WishlistLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-8 w-32 bg-zinc-100 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] bg-zinc-100 rounded-3xl animate-pulse" />
            <div className="mt-3 space-y-2">
              <div className="h-4 bg-zinc-100 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-zinc-100 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
