'use client';

import { Shield, Database, Lock, Globe, Users, Mail, FileText, PackageCheck } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import Accordion from '@/components/Accordion';

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Privacy Policy' },
];

const infoCategories = [
  {
    icon: FileText,
    title: 'Personal Information',
    items: [
      'Full name, email address, phone number, and shipping/billing address.',
      'Account login credentials if you create an account with us.',
      'Purchase history, preferences, and saved items.',
      'Communication preferences and feedback you provide.',
    ],
  },
  {
    icon: Database,
    title: 'Order Information',
    items: [
      'Payment details (processed securely through third-party gateways — we never store full card numbers).',
      'Product selections, sizes, quantities, and order value.',
      'Shipping address, delivery instructions, and order notes.',
      'Return and exchange records for customer service purposes.',
    ],
  },
  {
    icon: Globe,
    title: 'Device Information',
    items: [
      'IP address, browser type, and operating system.',
      'Device type and screen resolution for responsive optimization.',
      'Referral URLs and pages visited on our website.',
      'Time zone, language preferences, and geographic location.',
    ],
  },
];

const usageCards = [
  {
    icon: PackageCheck,
    title: 'Order Fulfillment',
    desc: 'Process orders, arrange shipping, process payments, send invoices, and provide order confirmations.',
  },
  {
    icon: Users,
    title: 'Customer Support',
    desc: 'Respond to your inquiries, resolve issues, provide product recommendations, and improve our service quality.',
  },
  {
    icon: Mail,
    title: 'Marketing',
    desc: 'Send you updates about new collections, exclusive offers, and style inspiration (only with your consent).',
  },
];

const cookieItems = [
  {
    title: 'Essential Cookies',
    content:
      'These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account access. Without these cookies, our website cannot function properly.',
  },
  {
    title: 'Analytics Cookies',
    content:
      'We use analytics cookies to understand how visitors interact with our website. This helps us improve your shopping experience by analyzing which pages are most popular, how users navigate our site, and identifying areas for improvement.',
  },
  {
    title: 'Marketing Cookies',
    content:
      'Marketing cookies are used to track visitors across websites to display relevant advertisements. We use these cookies to show you products and offers that match your interests and measure the effectiveness of our marketing campaigns.',
  },
];

const securityItems = [
  'All payment transactions are encrypted using SSL/TLS 256-bit technology.',
  'We do not store full credit card details on our servers.',
  'Regular security audits and penetration testing ensure our systems remain protected.',
  'Access to personal data is restricted to authorized personnel only.',
  'We comply with PCI DSS (Payment Card Industry Data Security Standard) requirements.',
];

const thirdPartyItems = [
  'Payment processors: Secure payment gateways that handle your transaction data.',
  'Shipping carriers: Courier partners who receive your address for delivery purposes.',
  'Analytics providers: Tools that help us understand website usage and improve our services.',
  'Marketing platforms: Services that help us communicate relevant offers and information.',
  'All third-party providers are contractually obligated to protect your data and use it only for the specified services.',
];

const customerRights = [
  'Right to access your personal data held by us.',
  'Right to rectify inaccurate or incomplete data.',
  'Right to erasure (request deletion of your personal data).',
  'Right to restrict or object to processing of your data.',
  'Right to data portability (receive your data in a structured format).',
  'Right to withdraw consent for marketing communications at any time.',
  'Right to lodge a complaint with a data protection authority.',
];

export default function PrivacyContent() {
  return (
    <PageLayout title="Privacy Policy" breadcrumbs={breadcrumbs}>
      {/* Last updated */}
      <p className="text-sm text-zinc-400 mb-10">
        Last updated: July 2025
      </p>

      {/* Information We Collect */}
      <section id="collect">
        <h2 className="ty-h2 text-noor-black mb-8">
          Information We Collect
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {infoCategories.map((cat) => (
            <div key={cat.title} className="bg-white border border-zinc-100 p-6 hover-lift">
              <div className="w-12 h-12 bg-noor-maroon/10 flex items-center justify-center mb-4">
                <cat.icon size={24} className="text-noor-maroon" />
              </div>
              <h3 className="text-base font-semibold text-noor-black mb-3">{cat.title}</h3>
              <ul className="space-y-2">
                {cat.items.map((item, i) => (
                  <li key={i} className="text-sm text-zinc-600 flex gap-2">
                    <span className="text-noor-maroon mt-1 shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How We Use Information */}
      <section id="usage" className="mt-14 md:mt-20">
        <h2 className="ty-h2 text-noor-black mb-8">
          How We Use Your Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {usageCards.map((card) => (
            <div key={card.title} className="bg-zinc-50 border border-zinc-100 p-6 hover-lift">
              <div className="w-12 h-12 bg-noor-maroon/10 flex items-center justify-center mb-4">
                <card.icon size={24} className="text-noor-maroon" />
              </div>
              <h3 className="text-base font-semibold text-noor-black mb-2">{card.title}</h3>
              <p className="text-sm text-zinc-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cookies */}
      <section id="cookies" className="mt-14 md:mt-20">
        <h2 className="ty-h2 text-noor-black mb-4">
          Cookies
        </h2>
        <p className="text-sm text-zinc-600 mb-8 max-w-3xl">
          We use cookies to enhance your browsing experience, analyze site traffic, and serve personalized
          content. You can control cookie preferences through your browser settings.
        </p>
        <Accordion items={cookieItems} />
      </section>

      {/* Data Security */}
      <section id="security" className="mt-14 md:mt-20">
        <div className="bg-white border border-zinc-100 p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-green-50 flex items-center justify-center shrink-0">
              <Lock size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="ty-h3 text-noor-black">
                Data Security
              </h2>
              <p className="text-sm text-zinc-500 mt-1">
                Your data security is our top priority. We implement industry-standard measures to protect your personal information.
              </p>
            </div>
          </div>
          <ul className="space-y-3">
            {securityItems.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-600">
                <Shield size={16} className="text-green-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Third-Party Services */}
      <section id="third-party" className="mt-14 md:mt-20">
        <h2 className="ty-h2 text-noor-black mb-8">
          Third-Party Services
        </h2>
        <div className="bg-zinc-50 border border-zinc-100 p-6 md:p-8">
          <p className="text-sm text-zinc-600 mb-6">
            We share your information with trusted third-party service providers who help us operate our
            business and serve you better. These include:
          </p>
          <ul className="space-y-4">
            {thirdPartyItems.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-600">
                <span className="w-6 h-6 rounded-full bg-noor-maroon/10 text-noor-maroon text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="pt-0.5">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Customer Rights */}
      <section id="rights" className="mt-14 md:mt-20">
        <h2 className="ty-h2 text-noor-black mb-8">
          Your Rights
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {customerRights.map((right, i) => (
            <div key={i} className="flex gap-3 bg-white border border-zinc-100 p-5 hover-lift">
              <CheckIcon />
              <p className="text-sm text-zinc-700">{right}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mt-14 md:mt-20">
        <div className="bg-noor-black p-8 md:p-12 text-white text-center">
          <Mail size={36} className="mx-auto mb-4 opacity-80" />
          <h2 className="ty-h2 mb-3">
            Privacy Questions?
          </h2>
          <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-6">
            If you have any questions about our privacy practices or would like to exercise your data rights,
            please contact our Data Protection Officer.
          </p>
          <a
            href="mailto:privacy@aaneddles.com"
            className="inline-flex items-center gap-2 px-8 py-3 bg-noor-maroon text-white ty-button hover:bg-noor-maroon/90 transition-colors"
          >
            <Mail size={14} />
            privacy@aaneddles.com
          </a>
        </div>
      </section>
    </PageLayout>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-600 shrink-0 mt-0.5">
      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
