'use client';

import { Truck, Clock, Search, MapPin, AlertTriangle, Info, PackageCheck, ShieldCheck } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Shipping Information' },
];

const processingSteps = [
  {
    icon: Clock,
    title: 'Processing Time',
    items: [
      'Orders are processed within 1–2 business days after payment confirmation.',
      'All orders undergo a thorough quality check before dispatch.',
      'Orders placed on weekends or public holidays will be processed the next business day.',
    ],
  },
  {
    icon: PackageCheck,
    title: 'Order Confirmation',
    items: [
      'You will receive an order confirmation email immediately after placing your order.',
      'A second email with tracking details will be sent once your order ships.',
      'Please check your spam folder if you do not receive confirmation within 24 hours.',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Quality Check Process',
    items: [
      'Every item is hand-inspected by our quality control team before packing.',
      'We ensure stitching, fabric, and finishing meet our luxury standards.',
      'Items that do not pass QC are flagged and replaced before dispatch.',
    ],
  },
];

const shippingMethods = [
  { method: 'Standard Domestic', delivery: '3–5 business days', cost: 'Free (orders > Rs.5,000)\nRs. 150 (below Rs.5,000)' },
  { method: 'Express Domestic', delivery: '1–2 business days', cost: 'Rs. 350' },
  { method: 'Standard International', delivery: '7–14 business days', cost: '$15 USD' },
  { method: 'Express International', delivery: '3–5 business days', cost: '$30 USD' },
];

const deliveryAreas = [
  {
    title: 'Domestic Shipping',
    items: [
      'We ship to all cities across Pakistan including Lahore, Karachi, Islamabad, and more.',
      'Free shipping on all orders above Rs. 5,000 within Pakistan.',
      'Standard delivery: 3–5 business days to major cities; 5–7 days to remote areas.',
    ],
  },
  {
    title: 'International Shipping',
    items: [
      'We offer worldwide shipping to over 50 countries.',
      'International orders are shipped via DHL, FedEx, or local postal partners.',
      'Customs duties and taxes are the responsibility of the customer.',
      'Delivery times vary by destination and shipping method selected.',
    ],
  },
];

const trackingSteps = [
  'Once your order ships, you will receive a tracking number via email and SMS.',
  'You can track your order in real-time using the tracking link provided.',
  'Allow 24–48 hours for the tracking status to update after dispatch.',
  'Domestic: Track via Pakistan Post, Trax, or Leopards Courier.',
  'International: Track via DHL, FedEx, or EMS.',
];

const delayCauses = [
  { icon: AlertTriangle, title: 'Weather Conditions', desc: 'Extreme weather may cause delays in transit. We prioritize safety and adjust routes accordingly.' },
  { icon: AlertTriangle, title: 'Public Holidays', desc: 'Orders placed near national holidays may experience processing delays. Our team will notify you of any changes.' },
  { icon: AlertTriangle, title: 'Customs Clearance', desc: 'International orders may be held at customs for inspection. Delays vary by country and are beyond our control.' },
  { icon: AlertTriangle, title: 'Peak Season', desc: 'During sales, festivals, and holiday seasons, processing and delivery may take 2–3 additional business days.' },
];

const importantNotes = [
  {
    icon: Info,
    title: 'Address Accuracy',
    desc: 'Please ensure your shipping address is correct. AA Neddles is not responsible for packages lost due to incorrect addresses.',
  },
  {
    icon: Info,
    title: 'Signature Required',
    desc: 'All deliveries require a signature upon receipt to ensure secure handover of your luxury items.',
  },
  {
    icon: Info,
    title: 'Shipping Insurance',
    desc: 'All shipments are insured against loss or damage during transit. Please inspect your package upon delivery.',
  },
];

export default function ShippingContent() {
  return (
    <PageLayout title="Shipping Information" breadcrumbs={breadcrumbs}>
      {/* Order Processing */}
      <section id="processing">
        <h2 className="ty-h2 text-noor-black mb-8">
          Order Processing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {processingSteps.map((step) => (
            <div key={step.title} className="bg-white border border-zinc-100 p-6 hover-lift">
              <div className="w-12 h-12 bg-noor-maroon/10 flex items-center justify-center mb-4">
                <step.icon size={24} className="text-noor-maroon" />
              </div>
              <h3 className="text-base font-semibold text-noor-black mb-3">{step.title}</h3>
              <ul className="space-y-2">
                {step.items.map((item, i) => (
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

      {/* Shipping Methods */}
      <section id="methods" className="mt-14 md:mt-20">
        <h2 className="ty-h2 text-noor-black mb-8">
          Shipping Methods
        </h2>
        <div className="overflow-x-auto border border-zinc-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-noor-black text-white">
                <th className="text-left px-6 py-4 font-medium uppercase tracking-wider text-xs">Method</th>
                <th className="text-left px-6 py-4 font-medium uppercase tracking-wider text-xs">Estimated Delivery</th>
                <th className="text-left px-6 py-4 font-medium uppercase tracking-wider text-xs">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {shippingMethods.map((row) => (
                <tr key={row.method} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-noor-black">{row.method}</td>
                  <td className="px-6 py-4 text-zinc-600">{row.delivery}</td>
                  <td className="px-6 py-4 text-zinc-600 whitespace-pre-line">{row.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Delivery Areas */}
      <section id="areas" className="mt-14 md:mt-20">
        <h2 className="ty-h2 text-noor-black mb-8">
          Delivery Areas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliveryAreas.map((area) => (
            <div key={area.title} className="bg-white border border-zinc-100 p-6 hover-lift">
              <div className="w-12 h-12 bg-noor-maroon/10 flex items-center justify-center mb-4">
                <MapPin size={24} className="text-noor-maroon" />
              </div>
              <h3 className="text-base font-semibold text-noor-black mb-3">{area.title}</h3>
              <ul className="space-y-2">
                {area.items.map((item, i) => (
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

      {/* Tracking Orders */}
      <section id="tracking" className="mt-14 md:mt-20">
        <h2 className="ty-h2 text-noor-black mb-8">
          Tracking Orders
        </h2>
        <div className="bg-zinc-50 border border-zinc-100 p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-noor-maroon/10 flex items-center justify-center shrink-0">
              <Search size={24} className="text-noor-maroon" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-noor-black mb-1">
                How to Track Your Order
              </h3>
              <p className="text-sm text-zinc-500">
                Stay updated on your order&apos;s journey from our studio to your doorstep.
              </p>
            </div>
          </div>
          <ul className="space-y-3">
            {trackingSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-zinc-600">
                <span className="w-6 h-6 rounded-full bg-noor-maroon text-white text-[11px] font-semibold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Shipping Delays */}
      <section id="delays" className="mt-14 md:mt-20">
        <h2 className="ty-h2 text-noor-black mb-8">
          Shipping Delays
        </h2>
        <p className="text-sm text-zinc-600 mb-6 max-w-3xl">
          While we strive to deliver all orders on time, certain factors beyond our control may occasionally cause delays.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {delayCauses.map((cause) => (
            <div key={cause.title} className="flex gap-4 bg-amber-50 border border-amber-200 p-5">
              <div className="w-10 h-10 bg-amber-100 flex items-center justify-center shrink-0">
                <cause.icon size={20} className="text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-amber-800">{cause.title}</h3>
                <p className="text-sm text-amber-700/80 mt-1">{cause.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Important Notes */}
      <section id="notes" className="mt-14 md:mt-20">
        <h2 className="ty-h2 text-noor-black mb-8">
          Important Notes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {importantNotes.map((note) => (
            <div key={note.title} className="bg-white border border-zinc-100 p-6 hover-lift">
              <div className="w-12 h-12 bg-noor-maroon/10 flex items-center justify-center mb-4">
                <note.icon size={24} className="text-noor-maroon" />
              </div>
              <h3 className="text-sm font-semibold text-noor-black mb-2">{note.title}</h3>
              <p className="text-sm text-zinc-600">{note.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-14 md:mt-20 bg-noor-black p-8 md:p-12 text-center">
        <h2 className="ty-h2 text-white mb-3">
          Need Help With Your Order?
        </h2>
        <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-6">
          Our customer support team is here to assist you with any shipping-related questions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:hello@aaneddles.com"
            className="inline-flex items-center justify-center px-8 py-3 bg-noor-maroon text-white ty-button hover:bg-noor-maroon/90 transition-colors"
          >
            Email Support
          </a>
          <a
            href="https://wa.me/9242111222333"
            className="inline-flex items-center justify-center px-8 py-3 border border-zinc-600 text-white ty-button hover:bg-white/10 transition-colors"
          >
            WhatsApp Us
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
