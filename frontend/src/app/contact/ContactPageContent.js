'use client';

import { useState } from 'react';
import Image from 'next/image';
import PageLayout from '@/components/PageLayout';
import { useToast } from '@/hooks/useToast';
import { api } from '@/services/index';

export default function ContactPageContent() {
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.trim()) {
      addToast('Please enter your email address.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/contact', {
        name: form.name || 'Anonymous',
        email: form.email,
        phone: form.phone || '',
        subject: form.subject || 'Contact Form',
        message: form.message || '',
      });
      addToast("Thank you! Your message has been sent. We'll get back to you soon.", 'success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      addToast('Failed to send message. Please try again later.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout
      title="Contact Us"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Contact' },
      ]}
      heroBackground={false}
    >
      <div className="space-y-16">
        <section className="grid gap-10 lg:grid-cols-[1.4fr_1fr] items-center">
          <div className="overflow-hidden shadow-2xl shadow-black/10">
            <Image
              src="/images/AA1.jpeg"
              alt="Contact Us"
              width={800}
              height={540}
              className="w-full h-full min-h-[540px] object-cover"
            />
          </div>

          <div className="space-y-8">
            <div className="border border-zinc-200 bg-white p-8 shadow-sm">
              <h2 className="ty-h2 text-noor-black">Contact Us</h2>
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="contact-name" className="block ty-body-sm font-medium text-zinc-700">Full Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Name"
                    className="mt-3 w-full border border-zinc-200 bg-zinc-50 px-5 py-4 ty-body text-zinc-700 outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block ty-body-sm font-medium text-zinc-700">Email *</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email *"
                    className="mt-3 w-full border border-zinc-200 bg-zinc-50 px-5 py-4 ty-body text-zinc-700 outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10"
                  />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="block ty-body-sm font-medium text-zinc-700">Phone Number</label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone number"
                    className="mt-3 w-full border border-zinc-200 bg-zinc-50 px-5 py-4 ty-body text-zinc-700 outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10"
                  />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block ty-body-sm font-medium text-zinc-700">Subject</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="Subject"
                    className="mt-3 w-full border border-zinc-200 bg-zinc-50 px-5 py-4 ty-body text-zinc-700 outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block ty-body-sm font-medium text-zinc-700">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Comment"
                    className="mt-3 w-full border border-zinc-200 bg-zinc-50 px-5 py-4 ty-body text-zinc-700 outline-none focus:border-noor-maroon focus:ring-2 focus:ring-noor-maroon/10"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center bg-noor-black px-8 py-4 ty-button text-white transition hover:bg-noor-gold disabled:opacity-60"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
