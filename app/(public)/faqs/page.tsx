import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BRAND } from '@/lib/brand';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'FAQs',
  description: 'Common questions about the UNMUTE DUO 14-day communication workshop, registration, and payment.',
};

const FAQS = [
  {
    q: 'What is the UNMUTE DUO workshop?',
    a: `It's a ${BRAND.durationDays}-day communication and speaking confidence workshop. You practise everyday conversations, self-introductions, group discussions, and more in a supportive environment.`,
  },
  {
    q: 'How much does it cost?',
    a: `The full workshop costs ₹${BRAND.fee}, paid once. This covers all ${BRAND.durationDays} days of practice.`,
  },
  {
    q: 'How do I register?',
    a: 'Complete the UNMUTE DUO Google Form and follow the organizers’ instructions. The organizers will confirm your registration.',
  },
  {
    q: 'How do I pay the fee?',
    a: `The workshop fee is ₹${BRAND.fee}. Payment instructions are provided by the organizers during registration.`,
  },
  {
    q: 'Who can join the workshop?',
    a: 'Students, fresh graduates, job seekers, young professionals, and anyone who wants to improve their communication and speaking confidence.',
  },
  {
    q: 'Is the curriculum fixed?',
    a: 'The learning journey is a general outline. The session-by-session curriculum will be shared once it is confirmed by the organizers.',
  },
  {
    q: 'Can I join the WhatsApp group?',
    a: 'Yes. You can join our WhatsApp group using the link on the homepage and registration pages. We do not add anyone automatically.',
  },
  {
    q: 'Who can I contact about my registration or payment?',
    a: `Contact us at ${BRAND.queriesEmails.join(' or ')} or call +91 ${BRAND.phones[0]} for help.`,
  },
];

export default function FAQsPage() {
  return (
    <div className="bg-brand-ivory">
      <section className="container-page py-14 md:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow">FAQs</p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-[#686868]">
            Everything you need to know about the workshop, registration, and payment.
          </p>

          <Accordion type="single" collapsible className="mt-8 w-full">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-brand-beige"
              >
                <AccordionTrigger className="py-5 text-left font-heading text-base font-semibold text-brand-navy hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-[#686868]">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10 rounded-2xl border border-brand-beige bg-white p-6 text-center">
            <h2 className="font-heading text-lg font-bold text-brand-navy">Still have questions?</h2>
            <p className="mt-1 text-sm text-[#686868]">Reach out and we&apos;ll get back to you.</p>
            <div className="mt-4 flex justify-center gap-3">
              <Button asChild className="bg-brand-coral text-white hover:bg-brand-coral/90">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button asChild variant="outline" className="border-brand-navy/30 text-brand-navy hover:bg-brand-navy/5">
                <Link href="/register/google-form">Register Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
