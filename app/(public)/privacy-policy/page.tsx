import { BRAND } from '@/lib/brand';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How UNMUTE DUO collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="container-page py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow">Privacy Policy</p>
        <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-brand-navy">
          Privacy Policy
        </h1>
        <div className="prose-cms mt-8 space-y-6 text-sm leading-relaxed text-[#292929]/80">
          <p>
            This policy explains what information {BRAND.name} collects, how we use it,
            and the choices you have. We collect only the information needed to run the
            workshop and communicate with you.
          </p>
          <h2 className="font-heading text-lg font-bold text-brand-navy">Information we collect</h2>
          <p>
            When you register through our Google Form, you provide the information
            requested there, such as your name and contact details. The form is hosted by
            Google and its responses are available to the workshop organizers.
          </p>
          <h2 className="font-heading text-lg font-bold text-brand-navy">How we use it</h2>
          <p>
            The organizers use your form response to manage your registration, share
            workshop-related updates, and respond to your queries. We do not sell or rent
            your personal information.
          </p>
          <h2 className="font-heading text-lg font-bold text-brand-navy">Data security</h2>
          <p>
            Google stores the form responses under its own services, and the organizers
            access them to manage the workshop. Follow the payment instructions provided
            by the organizers; do not enter payment credentials in the Google Form.
          </p>
          <h2 className="font-heading text-lg font-bold text-brand-navy">Your rights</h2>
          <p>
            You can request a copy of your data or ask us to correct it by contacting us
            at {BRAND.contactEmails.join(' or ')}. We will respond in a reasonable timeframe.
          </p>
          <h2 className="font-heading text-lg font-bold text-brand-navy">Contact</h2>
          <p>
            For privacy questions, email {BRAND.queriesEmails.join(' or ')} or call +91 {BRAND.phones[0]}.
          </p>
        </div>
      </div>
    </div>
  );
}
