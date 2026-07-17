import PageLayout from '@/components/PageLayout';

export const metadata = {
  title: 'Terms and Conditions — AA Neddles',
  description:
    'Read the terms and conditions for shopping at AA Neddles. Exchange policy, dispute resolution, payment terms, and more.',
  openGraph: {
    title: 'Terms and Conditions — AA Neddles',
    description: 'Read the terms and conditions for shopping at AA Neddles.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms and Conditions — AA Neddles',
    description: 'Read the terms and conditions for shopping at AA Neddles.',
  },
};

export default function TermsPage() {
  return (
    <PageLayout
      title="Terms and Conditions"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Terms and Conditions' },
      ]}
      heroBackground={false}
      titleAlign="center"
    >
      <div className="max-w-3xl mx-auto py-8 text-noor-gray text-sm leading-relaxed space-y-6">
        <p className="text-noor-black font-medium">Please read these terms and conditions carefully. These terms &amp; conditions, as modified or amended from time to time, are a binding contract between the company and you. If you visit, use, or shop at the site.</p>

        <div>
          <h3 className="text-noor-black font-semibold text-base mb-2">Governing Law</h3>
          <p>Any dispute or claim arising out of or in connection with this website shall be governed and construed in accordance with the stated laws.</p>
        </div>

        <div>
          <h3 className="text-noor-black font-semibold text-base mb-2">Exchange Policy</h3>
          <p>In case of any dispute, all products purchased from our website can be exchanged within 7 days only, subject to the following conditions:</p>
          <ol className="list-decimal pl-5 mt-2 space-y-1">
            <li>Exchange request is made within the stated time frame/limit.</li>
            <li>The item(s) is faulty, damaged or defective at the time of delivery.</li>
            <li>The received product(s) differed from the original order.</li>
            <li>Anything is missing from the package including price tags, labels, original packing, etc.</li>
          </ol>
        </div>

        <div>
          <h3 className="text-noor-black font-semibold text-base mb-2">Damaged or Missing Products</h3>
          <p>In case if the products are found damaged or missing, the outer packaging images are required to be shared via email at help@aaneddles.com as evidence before discarding the packaging.</p>
        </div>

        <div>
          <h3 className="text-noor-black font-semibold text-base mb-2">Dispute Resolution</h3>
          <p>Please email pictures of the defective item to help@aaneddles.com or call at +923111162742, within 7 days after order delivery in the case to raise a dispute. AA Neddles will look at each dispute on an individual basis and will make every effort to be fair to both parties. Once the dispute is settled fairly, we will then issue a replacement (product) against the product mentioned in the invoice or entertain you with a coupon of the same product(s) value that can be used to purchase from AA Neddles within the next 60 days.</p>
          <p className="mt-2">Please note that no dispute will be accepted after a given time period i.e. 7 days after order delivery.</p>
        </div>

        <div>
          <h3 className="text-noor-black font-semibold text-base mb-2">Buyer Responsibility</h3>
          <p>Buyer/Customer/order maker is fully responsible for all the purchases made in good faith and have no intentions of false activity. In addition, the buyer must also solely take the responsibility of all selections made (articles/dresses/products).</p>
        </div>

        <div>
          <h3 className="text-noor-black font-semibold text-base mb-2">Marketing &amp; Communications</h3>
          <p>AA Neddles is able to share marketing offers such as newsletters and our catalogues (e.g. your email address, wish lists, your name, and your postal address). Also can create your personal account at aaneddles.com (e.g. your name, number, and email address).</p>
          <p className="mt-2">Our team can contact you in the event of any problem with the delivery of your items (e.g. telephone number, address).</p>
        </div>

        <div>
          <h3 className="text-noor-black font-semibold text-base mb-2">Data Disclosure</h3>
          <p>AA Neddles can disclose your data to fraud prevention agencies.</p>
        </div>

        <div>
          <h3 className="text-noor-black font-semibold text-base mb-2">Age Verification</h3>
          <p>We can validate that you are of legal age for shopping online.</p>
        </div>

        <div>
          <h3 className="text-noor-black font-semibold text-base mb-2">Payment</h3>
          <p>We accept payments online using Visa and MasterCard credit/debit card in Pkr (or any other agreed currencies).</p>
          <p className="mt-2">Payments you make for buying the products on our website, the details you are asked to submit will be provided directly to our payment provider via a secure connection.</p>
        </div>
      </div>
    </PageLayout>
  );
}
