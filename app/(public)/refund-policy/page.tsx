import Link from 'next/link';
import { BRAND } from '@/lib/brand';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Refund Policy',
  description: 'Refund eligibility and process for the UNMUTE DUO workshop.',
};

export default function RefundPolicyPage() {
  return (
    <div className="container-page py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Refund Policy</p>
        <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-brand-navy">
          Refund Policy
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[#292929]/80">
          <div className="rounded-xl border border-brand-beige bg-brand-ivory/50 p-5">
            <p className="text-brand-navy">
              <strong>Note:</strong> The exact refund window and conditions will follow the
              policy finalized by the organizers. The points below describe how refunds
              are processed once eligible.
            </p>
          </div>
          <h2 className="font-heading text-lg font-bold text-brand-navy">Eligibility</h2>
          <p>
            Refund eligibility depends on the policy set by the organizers. Contact
            them to confirm whether your registration qualifies.
          </p>
          <h2 className="font-heading text-lg font-bold text-brand-navy">How refunds work</h2>
          <p>
            If a refund is approved, the organizers will arrange it and let you know
            when it has been processed.
          </p>
          <h2 className="font-heading text-lg font-bold text-brand-navy">Payment questions</h2>
          <p>
            For payment or refund questions, contact the organizers using the details
            below and include the information from your Google Form submission.
          </p>
          <h2 className="font-heading text-lg font-bold text-brand-navy">Contact</h2>
          <p>
            To request a refund, email {BRAND.contactEmails.join(' or ')} or call +91 {BRAND.phones[0]} with
            the details from your Google Form submission.
          </p>
        </div>
        <div className="mt-8">
          <Button asChild className="bg-brand-coral text-white hover:bg-brand-coral/90">
            <Link href="/register/google-form">Register Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
