import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="ty-hero text-noor-maroon mb-4">404</p>
        <h1 className="ty-h3 text-noor-black mb-3">
          Page Not Found
        </h1>
        <p className="text-noor-gray text-sm mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3 bg-noor-black text-white ty-button hover:bg-noor-maroon transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
