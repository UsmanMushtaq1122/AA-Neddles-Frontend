'use client';

import { createWhatsAppOrderUrl, WHATSAPP_BUSINESS_NUMBER } from '@/lib/whatsapp';

function WhatsAppIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16.04 2.67A13.28 13.28 0 0 0 4.61 22.7L2.67 29.33l6.8-1.78a13.3 13.3 0 1 0 6.57-24.88Zm0 24.17c-2.04 0-4.05-.55-5.8-1.6l-.42-.25-4.03 1.06 1.08-3.93-.27-.44a10.83 10.83 0 1 1 9.44 5.16Zm5.95-8.12c-.33-.16-1.95-.96-2.25-1.07-.3-.11-.52-.16-.74.16-.22.33-.85 1.07-1.04 1.29-.19.22-.38.25-.71.08-.33-.16-1.4-.52-2.66-1.65-.98-.87-1.64-1.95-1.83-2.28-.19-.33-.02-.51.14-.67.15-.14.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.06-.41-.03-.57-.08-.16-.74-1.79-1.01-2.45-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.41-.3.33-1.15 1.12-1.15 2.74s1.18 3.18 1.34 3.4c.16.22 2.32 3.54 5.62 4.96.79.34 1.41.54 1.89.69.79.25 1.5.21 2.06.13.63-.09 1.95-.8 2.23-1.57.27-.77.27-1.43.19-1.57-.08-.14-.3-.22-.63-.38Z" />
    </svg>
  );
}

export default function WhatsAppOrderLink({
  product,
  size,
  className = '',
  iconOnly = false,
  requireSize = false,
  onMissingSize,
}) {
  const handleClick = (event) => {
    event.preventDefault();
    if (requireSize && !size) {
      onMissingSize?.();
      return;
    }
    const url = createWhatsAppOrderUrl(product, {
      size,
      baseUrl: window.location.origin,
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <a
      href={`https://wa.me/${WHATSAPP_BUSINESS_NUMBER}`}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order on WhatsApp"
      title="Order on WhatsApp"
      className={className}
    >
      <WhatsAppIcon />
      {!iconOnly && <span>ORDER ON WHATSAPP</span>}
    </a>
  );
}
