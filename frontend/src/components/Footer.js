import Link from 'next/link';

const informationLinks = [
  { label: 'Returns and Exchange', href: '/return-exchange-policy' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Store Locator', href: '/store-locations' },
  { label: 'Track Your Order', href: '/order-tracking' },
  { label: 'Blogs', href: '/about' },
];

const customerCareLinks = [
  { label: 'About AA Neddles', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Careers', href: '/careers' },
  { label: 'Terms and Conditions', href: '/terms' },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { label: 'TikTok', href: 'https://tiktok.com', icon: 'tiktok' },
];

function SocialIcon({ href, label, icon }) {
  const iconClass = 'h-5 w-5';

  const renderIcon = () => {
    switch (icon) {
      case 'instagram':
        return (
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={iconClass} stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4.1" />
            <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
          </svg>
        );
      case 'facebook':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={iconClass}>
            <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.2-1.5 1.6-1.5H16V4.6c-.4 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.6v1.8H6.3V14h2.7v8h4.5Z" />
          </svg>
        );
      case 'tiktok':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={iconClass}>
            <path d="M16.5 4.5c.8 1.6 2 2.7 3.5 3v3.2c-1.6 0-3.2-.5-4.4-1.4v6.2c0 3.4-2.8 6.1-6.2 6.1-3.3 0-6-2.6-6-5.9s2.7-5.9 6-5.9c.3 0 .6 0 1 .1v3.2c-.3-.1-.6-.2-1-.2-1.6 0-2.9 1.2-2.9 2.8 0 1.7 1.3 2.9 3 2.9 1.6 0 2.9-1.2 2.9-2.9V3h3.1c0 .5.1 1 .2 1.5Z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="text-noor-muted transition-colors hover:text-noor-black"
    >
      {renderIcon()}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-noor-lightgray bg-white text-noor-black pt-12 md:pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr_1fr] md:gap-12 lg:gap-16">
          <div>
            <h3 className="font-body text-3xl md:text-[32px] font-medium tracking-[0.14em] uppercase text-noor-black">
              AA NEDDLES.
            </h3>

            <div className="mt-6 space-y-1.5" style={{ lineHeight: '1.8' }}>
              <p className="font-body text-sm text-noor-muted">5.5 KM, Raiwind Road (Near Fatehbad Village)</p>
              <p className="font-body text-sm text-noor-muted">Lahore, Pakistan.</p>
              <p className="font-body text-sm text-noor-muted">Call: <a href="tel:+923111162742" className="hover:text-noor-black transition-colors">+923111162742</a></p>
              <p className="font-body text-sm text-noor-muted">WhatsApp: <a href="https://wa.me/923154001914" target="_blank" rel="noreferrer" className="hover:text-noor-black transition-colors">+923154001914</a></p>
              <p className="font-body text-sm text-noor-muted">Email: info@aeneddles.com</p>
            </div>
          </div>

          <div>
            <h4 className="font-body text-[17px] font-semibold text-noor-black mb-4 md:mb-5">Information</h4>
            <ul className="space-y-3">
              {informationLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body text-sm text-noor-muted transition-colors hover:text-noor-black">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-body text-[17px] font-semibold text-noor-black mb-4 md:mb-5">Customer Care</h4>
            <ul className="space-y-3">
              {customerCareLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body text-sm text-noor-muted transition-colors hover:text-noor-black">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-noor-lightgray pt-6 md:mt-16 md:pt-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="font-body text-xs md:text-sm text-noor-muted">
              &copy; {new Date().getFullYear()}, AA Neddles Designs
            </p>

            <div className="flex items-center gap-6 md:gap-7">
              {socialLinks.map((social) => (
                <SocialIcon key={social.label} {...social} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
