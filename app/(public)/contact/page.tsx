import { Phone, Mail, MessageCircle } from 'lucide-react';
import { BRAND } from '@/lib/brand';
import { ContactForm } from '@/components/site/contact-form';

export const metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the UNMUTE DUO team about the workshop, registration, or any questions.',
};

export default function ContactPage() {
  return (
    <div className="bg-brand-ivory">
      <section className="container-page py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
            We&apos;d love to hear from you
          </h1>
          <p className="mt-4 text-[#686868]">
            Questions about the workshop or registration? Send us a message and we&apos;ll
            reply as soon as we can.
          </p>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container-page grid gap-10 md:grid-cols-3">
          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-coral">Call us</h2>
              <ul className="mt-3 space-y-2 text-brand-navy">
                <li>
                  <a href={`tel:+91${BRAND.phones[0]}`} className="flex items-center gap-2 hover:text-brand-coral">
                    <Phone className="h-4 w-4" /> +91 {BRAND.phones[0]}
                  </a>
                </li>
                <li>
                  <a href={`tel:+91${BRAND.phones[1]}`} className="flex items-center gap-2 hover:text-brand-coral">
                    <Phone className="h-4 w-4" /> +91 {BRAND.phones[1]}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-coral">Email</h2>
              <p className="mt-3">
                <a href={`mailto:${BRAND.contactEmails.join(',')}`} className="flex items-center gap-2 text-brand-navy hover:text-brand-coral">
                  <Mail className="h-4 w-4" /> {BRAND.contactEmails.join(' / ')}
                </a>
              </p>
              <p className="mt-2 text-sm text-brand-navy">
                Queries: <a href={`mailto:${BRAND.queriesEmails.join(',')}`} className="hover:text-brand-coral">{BRAND.queriesEmails.join(' / ')}</a>
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-brand-coral">WhatsApp</h2>
              <p className="mt-3">
                <a
                  href={BRAND.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brand-navy hover:text-brand-coral"
                >
                  <MessageCircle className="h-4 w-4" /> Join our WhatsApp group
                </a>
              </p>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-2xl border border-brand-beige bg-brand-ivory/50 p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
