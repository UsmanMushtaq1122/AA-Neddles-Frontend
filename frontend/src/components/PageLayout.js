import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default function PageLayout({
  title,
  breadcrumbs = [],
  children,
  heroBackground = true,
}) {
  return (
    <div>
      {/* Spacer for fixed header — main bar is always 62 px on inner pages */}
      <div style={{ height: '62px' }} aria-hidden="true" />
      {heroBackground && (
        <div className="bg-noor-cream py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {breadcrumbs.length > 0 && (
              <nav className="flex items-center gap-1.5 ty-caption text-zinc-400 mb-4" aria-label="Breadcrumb">
                {breadcrumbs.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
                    {crumb.href ? (
                      <Link href={crumb.href} className="hover:text-noor-black transition-colors">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-noor-black font-medium" aria-current="page">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
            {title && (
              <h1 className="ty-h1 text-noor-black">
                {title}
              </h1>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {!heroBackground && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 ty-caption text-zinc-400 mb-8" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} aria-hidden="true" />}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-noor-black transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-noor-black font-medium" aria-current="page">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {children}
      </div>
    </div>
  );
}
