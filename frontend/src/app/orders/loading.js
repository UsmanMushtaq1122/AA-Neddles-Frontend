export default function OrdersLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="h-8 w-32 bg-zinc-100 rounded animate-pulse mb-8" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white border border-zinc-100 p-5">
            <div className="h-5 bg-zinc-100 rounded animate-pulse w-1/3 mb-3" />
            <div className="h-4 bg-zinc-100 rounded animate-pulse w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
