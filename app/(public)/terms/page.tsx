import { BRAND } from '@/lib/brand';

export const metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions for participating in the UNMUTE DUO workshop.',
};

export default function TermsPage() {
  return (
    <div className="container-page py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Terms &amp; Conditions</p>
        <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-brand-navy">
          Terms &amp; Conditions
        </h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-[#292929]/80">
          <p>
            By registering for the {BRAND.name} workshop, you agree to these terms.
          </p>
          <h2 className="font-heading text-lg font-bold text-brand-navy">Registration &amp; payment</h2>
          <p>
            Complete the Google Form and follow the organizers&apos; payment instructions.
            The organizers will confirm your registration and participation.
          </p>
          <h2 className="font-heading text-lg font-bold text-brand-navy">Participation</h2>
          <p>
            The workshop is a supportive space. Participants are expected to treat peers
            with respect. Disruptive behaviour may result in removal without refund at
            the organizers&apos; discretion.
          </p>
          <h2 className="font-heading text-lg font-bold text-brand-navy">Content</h2>
          <p>
            Workshop materials are for your personal use. You may not redistribute or
            resell them. The curriculum is shared as a general outline and may be updated
            by the organizers.
          </p>
          <h2 className="font-heading text-lg font-bold text-brand-navy">Changes</h2>
          <p>
            We may update these terms as the workshop evolves. Continued participation
            after changes constitutes acceptance of the updated terms.
          </p>
          <h2 className="font-heading text-lg font-bold text-brand-navy">Contact</h2>
          <p>
          Questions? Email {BRAND.queriesEmails.join(' or ')} or call +91 {BRAND.phones[0]}.
          </p>
        </div>
      </div>
    </div>
  );
}
