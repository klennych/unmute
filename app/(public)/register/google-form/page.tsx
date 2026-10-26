import Link from 'next/link';
import { ExternalLink, ClipboardList, WalletCards, MessageCircle, Mail, Phone } from 'lucide-react';
import { BRAND } from '@/lib/brand';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Register Using Google Form',
  description: 'Complete your registration through the UNMUTE DUO Google Form.',
};

const NEXT_STEPS = [
  {
    icon: ClipboardList,
    title: 'Share your details',
    description: 'Complete the UNMUTE DUO Google Form with the requested registration information.',
  },
  {
    icon: WalletCards,
    title: 'Follow the payment instructions',
    description: `The organizers will share how to pay the one-time ₹${BRAND.fee} workshop fee.`,
  },
  {
    icon: MessageCircle,
    title: 'Wait for confirmation',
    description: 'The organizers will confirm your registration.',
  },
];

export default function GoogleFormPage() {
  return (
    <div className="bg-brand-ivory">
      <section className="container-page py-14 md:py-20">
        <div className="mx-auto max-w-2xl">
          <p className="eyebrow">Google Form Registration</p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
            Register through our Google Form
          </h1>
          <p className="mt-4 text-[#686868]">
            The 14-day workshop costs ₹{BRAND.fee} once. Here&apos;s what happens when you register:
          </p>

          <ol className="mt-8 space-y-3">
            {NEXT_STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4 rounded-xl border border-brand-beige bg-white p-4 sm:p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-navy text-brand-coral">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-heading font-bold text-brand-navy">{index + 1}. {step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#686868]">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-6 flex flex-col gap-3">
            <Button asChild size="lg" className="bg-brand-coral text-white hover:bg-brand-coral/90">
              <a href={BRAND.googleFormLink} target="_blank" rel="noopener noreferrer">
                Open the Google Form <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <div className="mt-6 rounded-xl bg-brand-beige/40 p-4">
            <p className="text-sm font-semibold text-brand-navy">Need help before you register?</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a className="inline-flex items-center gap-2 text-brand-navy underline underline-offset-4" href={`mailto:${BRAND.contactEmails.join(',')}`}>
                <Mail className="h-4 w-4 text-brand-coral" aria-hidden="true" /> {BRAND.contactEmails.join(' / ')}
              </a>
              <a className="inline-flex items-center gap-2 text-brand-navy underline underline-offset-4" href={`tel:+91${BRAND.phones[0]}`}>
                <Phone className="h-4 w-4 text-brand-coral" aria-hidden="true" /> +91 {BRAND.phones[0]}
              </a>
            </div>
          </div>

          <p className="mt-6 text-xs text-[#686868]">
            By continuing you agree to our{' '}
            <Link href="/terms" className="underline">Terms</Link> and{' '}
            <Link href="/privacy-policy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
