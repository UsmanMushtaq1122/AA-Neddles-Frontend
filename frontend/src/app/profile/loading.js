export default function ProfileLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="h-8 w-32 bg-zinc-100 rounded animate-pulse mb-8" />
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-zinc-100 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 bg-zinc-100 rounded animate-pulse w-40" />
            <div className="h-4 bg-zinc-100 rounded animate-pulse w-60" />
          </div>
        </div>
        <div className="h-64 bg-zinc-100 rounded animate-pulse" />
      </div>
    </div>
  );
}
