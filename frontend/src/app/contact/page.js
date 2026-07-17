import ContactPageContent from './ContactPageContent';

export const metadata = {
  title: 'Contact Us — AA Neddles',
  description:
    'Get in touch with AA Neddles. Reach out for order inquiries, customer support, or business partnerships.',
  openGraph: {
    title: 'Contact Us — AA Neddles',
    description: 'Get in touch with AA Neddles for order inquiries and support.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us — AA Neddles',
    description: 'Get in touch with AA Neddles for order inquiries and support.',
  },
};

export default function ContactPageWrapper() {
  return <ContactPageContent />;
}
