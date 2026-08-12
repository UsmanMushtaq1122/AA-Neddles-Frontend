export default function CheckoutLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="h-8 w-48 bg-zinc-100 rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-4">
          <div className="h-14 bg-zinc-100 rounded animate-pulse w-full" />
          <div className="h-14 bg-zinc-100 rounded animate-pulse w-full" />
          <div className="h-14 bg-zinc-100 rounded animate-pulse w-3/4" />
          <div className="h-14 bg-zinc-100 rounded animate-pulse w-full" />
          <div className="h-12 bg-zinc-100 rounded animate-pulse w-full mt-4" />
        </div>
        <div className="lg:col-span-2">
          <div className="h-80 bg-zinc-100 rounded animate-pulse w-full" />
        </div>
      </div>
    </div>
  );
}
