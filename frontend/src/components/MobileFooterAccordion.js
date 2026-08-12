'use client';

import { useId } from 'react';
import Link from 'next/link';
import { Minus, Plus } from 'lucide-react';

export default function MobileFooterAccordion({ title, links, isOpen, onToggle }) {
  const panelId = useId();

  return (
    <div className="mobile-footer-accordion">
      <button
        type="button"
        className="mobile-footer-accordion-trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span>{title}</span>
        {isOpen ? <Minus size={22} strokeWidth={1.5} aria-hidden="true" /> : <Plus size={22} strokeWidth={1.5} aria-hidden="true" />}
      </button>

      <div
        id={panelId}
        className={`mobile-footer-accordion-panel ${isOpen ? 'is-open' : ''}`}
        role="region"
        aria-label={`${title} links`}
      >
        <ul className="mobile-footer-accordion-links">
          {links.map((link) => (
            <li key={`${link.href}-${link.label}`}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}