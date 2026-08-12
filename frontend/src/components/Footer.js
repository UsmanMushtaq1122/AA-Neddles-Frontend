'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import MobileFooterAccordion from '@/components/MobileFooterAccordion';

const footerSections = [
  {
    title: 'Contact',
    links: [
      { label: 'Email', href: 'mailto:info@aeneddles.com' },
      { label: 'Phone Number', href: 'tel:+923111162742' },
      { label: 'WhatsApp', href: 'https://wa.me/923154001914' },
      { label: 'Store Location', href: '/store-locations' },
    ],
  },
  {
    title: 'Information',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'FAQs', href: '/faqs' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Track Order', href: '/order-tracking' },
      { label: 'Return Policy', href: '/return-exchange-policy' },
      { label: 'Shipping Policy', href: '/shipping-information' },
      { label: 'Contact Support', href: '/contact' },
    ],
  },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/aaneddles', icon: 'instagram' },
  { label: 'Facebook', href: 'https://facebook.com/aaneddles', icon: 'facebook' },
  { label: 'TikTok', href: 'https://tiktok.com/@aaneddles', icon: 'tiktok' },
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
  const [openSection, setOpenSection] = useState(null);

  return (
    <footer className="mobile-footer">
      <div className="mobile-footer-inner">
        <div className="desktop-footer-content">
          <div className="desktop-footer-main">
            <div className="desktop-footer-contact">
              <Link href="/" aria-label="AA Neddles home" className="desktop-footer-logo-link">
                <Image
                  src="/logo.png"
                  alt="AA Neddles"
                  width={220}
                  height={220}
                  className="desktop-footer-logo"
                />
              </Link>
              <address className="desktop-footer-address">
                <span>5.5 KM, Raiwind Road (Near Fatehbad Village)</span>
                <span>Lahore, Pakistan.</span>
                <a href="tel:+923111162742">Call: +923111162742</a>
                <a href="https://wa.me/923154001914" target="_blank" rel="noreferrer">WhatsApp: +923154001914</a>
                <a href="mailto:info@aeneddles.com">Email: info@aeneddles.com</a>
              </address>
            </div>

            <div className="desktop-footer-column">
              <h2>Information</h2>
              <Link href="/return-exchange-policy">Returns and Exchange</Link>
              <Link href="/privacy-policy">Privacy Policy</Link>
              <Link href="/faqs">FAQs</Link>
              <Link href="/store-locations">Store Locator</Link>
              <Link href="/order-tracking">Track Your Order</Link>
            </div>

            <div className="desktop-footer-column">
              <h2>Customer Care</h2>
              <Link href="/about">About AA Neddles</Link>
              <Link href="/contact">Contact Us</Link>
              <Link href="/careers">Careers</Link>
              <Link href="/terms">Terms and Conditions</Link>
            </div>
          </div>

          <div className="desktop-footer-bottom">
            <p>&copy; {new Date().getFullYear()}, AA Neddles Designs</p>
            <div className="desktop-footer-socials">
              {socialLinks.map((social) => (
                <SocialIcon key={social.label} {...social} />
              ))}
            </div>
          </div>
        </div>

        <Link href="/" aria-label="AA Neddles home" className="mobile-footer-logo-link">
          <Image
            src="/logo.png"
            alt="AA Neddles"
            width={220}
            height={220}
            priority={false}
            className="mobile-footer-logo"
          />
        </Link>

        <div className="mobile-footer-sections">
          {footerSections.map((section, index) => (
            <MobileFooterAccordion
              key={section.title}
              title={section.title}
              links={section.links}
              isOpen={openSection === index}
              onToggle={() => setOpenSection(openSection === index ? null : index)}
            />
          ))}
        </div>

        <div className="mobile-footer-bottom">
          <p>&copy; {new Date().getFullYear()}, AA Neddles Designs</p>

          <div className="mobile-footer-socials">
            {socialLinks.map((social) => (
              <SocialIcon key={social.label} {...social} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
