'use client';

import { RotateCcw, AlertTriangle, CheckCircle, Mail, MessageSquare, ArrowRight, Undo2, Box, Search, RefreshCw, Package, Ban, Scissors, Gem, Shield, Tag } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const breadcrumbs = [
  { label: 'Home', href: '/' },
  { label: 'Return & Exchange Policy' },
];

const eligibilityItems = [
  {
    icon: AlertTriangle,
    title: 'Faulty, Damaged or Defective',
    desc: 'The item(s) is faulty, damaged or defective at the time of delivery.',
  },
  {
    icon: Package,
    title: 'Wrong Product Received',
    desc: 'The received product(s) differed from the original order.',
  },
  {
    icon: Search,
    title: 'Missing Items',
    desc: 'Anything is missing from the package including price tags, labels, original packing etc.',
  },
];

const nonReturnableItems = [
  { icon: Tag, text: 'Discounted Items cannot be Returned / Exchanged.' },
  { icon: Scissors, text: 'Unstitched articles once stitched will not be entertained.' },
  { icon: Gem, text: 'Wedding Wear and Couture dresses cannot be exchanged or returned under any circumstances.' },
  { icon: Ban, text: 'M. Luxe Fabric once purchased cannot be Returned / Exchanged.' },
];

const cancellationPolicy = [
  'AA Neddles does not offer a "refund" or "money back guarantee" on purchased items.',
  'Customers paying via Credit Card or PayPal may cancel within 24 hours of placing the order. Order amount will not be refunded back instead a coupon of same value will be provided that can be used to purchase from AA Neddles within next 60 days.',
  'AA Neddles may cancel orders for any reason. Common reasons may include: the item is out of stock, damage found during quality check, technical error or credit card or PayPal payment is declined.',
  'We do not store Credit card details nor do we share customer details with any 3rd parties.',
];

const disclaimerItems = [
  'AA Neddles makes every effort to ensure that product images & descriptions are as accurate as possible. Please note, however, that there might be some minor differences between product images on the website and the actual product. Such variations may come about due to extra embellishments used during shoots which may differ from original products slightly.',
  'Please bear in mind that colors in pictures may vary slightly from actual item due to the lighting during photo shoot, your device display settings or printing quality of catalog and/or inlay cards.',
  'All details of AA Neddles products are given on the website and we make every effort to guarantee that the information provided is accurate. Customers are requested to review the product description before making an order.',
];

export default function ReturnContent() {
  return (
    <PageLayout title="Returns and Exchange" breadcrumbs={breadcrumbs}>

      {/* Main Policy Intro */}
      <section>
        <div className="bg-red-50 border border-red-200 p-6 md:p-8 mb-12">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 bg-red-100 flex items-center justify-center shrink-0">
              <Ban size={20} className="text-red-600" />
            </div>
            <p className="ty-body-sm font-medium text-red-800">
              AA Neddles does not offer any &lsquo;Exchange&rsquo; or &lsquo;Return&rsquo; for any of products.
            </p>
          </div>
        </div>

        <h2 className="ty-h2 text-noor-black mb-6">
          Exchange Conditions
        </h2>
        <p className="ty-body-sm text-zinc-600 mb-6">
          All products purchased from our Site can be exchanged within <strong>07 days</strong> only if:
        </p>
        <ul className="space-y-4 mb-8">
          {eligibilityItems.map((item, i) => (
            <li key={i} className="flex gap-4 items-start">
              <div className="w-10 h-10 bg-noor-cream flex items-center justify-center shrink-0">
                <item.icon size={20} className="text-noor-maroon" />
              </div>
              <div>
                <p className="ty-body-sm font-semibold text-noor-black">{item.title}</p>
                <p className="ty-body-sm text-zinc-600">{item.desc}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="ty-body-sm text-zinc-600 mb-4">
          Exchange request is made within the stated time frame/limit.
        </p>
        <p className="ty-body-sm text-zinc-600 mb-8">
          In such cases, claims can only be entertained if they are made within <strong>07 days</strong> of the original order date.
        </p>

        <div className="bg-zinc-50 border border-zinc-100 p-6 md:p-8 mb-8">
          <p className="ty-body-sm text-zinc-600 mb-4">
            Please email pictures of the defective item to <strong>help@aaneddles.com</strong> or call at <strong>+923111162742</strong>, within 7 days after order delivery in case to raise a dispute. AA Neddles will look at each dispute on an individual basis and will make every effort to be fair to both parties.
          </p>
          <p className="ty-body-sm text-zinc-600">
            Once we receive the item our team will review the damage &mdash; once the dispute is settled fairly we will issue a replacement of the same value against the product mentioned in the invoice and send it to the buyer&apos;s address.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-5 mb-6">
          <p className="ty-body-sm font-medium text-amber-800">
            In case of exchange customer will be responsible for all shipping, handling costs.
          </p>
        </div>
      </section>

      {/* Non-Returnable Items */}
      <section id="non-returnable" className="mt-14 md:mt-20">
        <h2 className="ty-h2 text-noor-black mb-8">
          Non-Returnable Items
        </h2>
        <div className="space-y-3">
          {nonReturnableItems.map((item, i) => (
            <div key={i} className="flex gap-4 bg-red-50 border border-red-200 p-5 items-start">
              <div className="w-10 h-10 bg-red-100 flex items-center justify-center shrink-0">
                <item.icon size={20} className="text-red-600" />
              </div>
              <p className="ty-body-sm text-red-800 pt-1.5">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Order Cancellation */}
      <section id="cancellation" className="mt-14 md:mt-20">
        <h2 className="ty-h2 text-noor-black mb-8">
          Order Cancellation
        </h2>
        <div className="bg-zinc-50 border border-zinc-100 p-6 md:p-8">
          <ul className="space-y-4">
            {cancellationPolicy.map((item, i) => (
              <li key={i} className="flex gap-3 ty-body-sm text-zinc-600">
                <CheckCircle size={18} className="text-noor-maroon shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Product Disclaimer */}
      <section id="disclaimer" className="mt-14 md:mt-20">
        <h2 className="ty-h2 text-noor-black mb-8">
          Product Disclaimer
        </h2>
        <div className="space-y-4">
          {disclaimerItems.map((item, i) => (
            <div key={i} className="flex gap-3 ty-body-sm text-zinc-600">
              <CheckCircle size={18} className="text-zinc-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support */}
      <section id="contact" className="mt-14 md:mt-20">
        <div className="bg-gradient-to-br from-noor-maroon to-noor-maroon/90 p-8 md:p-12 text-white text-center">
          <Mail size={40} className="mx-auto mb-4 opacity-80" />
          <h2 className="ty-h2 mb-3">
            Need Help With a Return?
          </h2>
          <p className="text-white/80 ty-body-sm max-w-lg mx-auto mb-8">
            Our customer support team is ready to assist you with returns, exchanges, and refunds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:help@aaneddles.com"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-noor-maroon ty-button hover:bg-zinc-100 transition-colors"
            >
              <Mail size={14} />
              Email Returns
            </a>
            <a
              href="https://wa.me/923154001914"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-white/30 text-white ty-button hover:bg-white/10 transition-colors"
            >
              <MessageSquare size={14} />
              WhatsApp Support
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
