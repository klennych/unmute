import Link from 'next/link';
import { ArrowRight, CheckCircle2, CalendarDays, Mic, Users, MessageCircle, Phone } from 'lucide-react';
import { BRAND } from '@/lib/brand';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Workshop Details',
  description:
    'A 14-day communication and speaking confidence workshop for ₹300. Daily practice, group interaction, and a supportive environment.',
};

const TOPICS = [
  'Everyday conversations',
  'Fluency and clarity',
  'Overcoming hesitation',
  'Self-introductions and interview practice',
  'Group discussions',
  'Interactive speaking activities',
];

const DETAILS = [
  { icon: CalendarDays, label: 'Duration', value: `${BRAND.durationDays} days` },
  { icon: Mic, label: 'Fee', value: `₹${BRAND.fee}` },
  { icon: Users, label: 'Format', value: 'Speaking and group practice' },
  { icon: MessageCircle, label: 'Activities', value: 'Speaking practice and group interaction' },
];

export default function WorkshopPage() {
  return (
    <div className="bg-brand-ivory">
      <section className="container-page py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="eyebrow">The Workshop</p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
            14-Day Communication &amp; Speaking Confidence Workshop
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[#292929]/80">
            A focused, practice-led workshop designed to help you stop hesitating and
            start speaking. Over {BRAND.durationDays} days, you&apos;ll build the habits
            that make everyday communication feel natural.
          </p>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DETAILS.map((d) => (
            <div key={d.label} className="rounded-xl border border-brand-beige bg-brand-ivory/50 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-brand-coral">
                <d.icon className="h-5 w-5" />
              </span>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#686868]">{d.label}</p>
              <p className="font-heading text-lg font-bold text-brand-navy">{d.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="section-title">What you&apos;ll practise</h2>
            <p className="mt-3 text-[#686868]">
              Every day focuses on a small, doable step toward confident communication.
            </p>
            <ul className="mt-6 space-y-3">
              {TOPICS.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-brand-coral" />
                  <span className="text-brand-navy">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-brand-beige bg-white p-8">
            <h3 className="font-heading text-xl font-bold text-brand-navy">Workshop fee</h3>
            <p className="mt-2 font-heading text-4xl font-extrabold text-brand-coral">₹{BRAND.fee}</p>
            <p className="mt-2 text-sm text-[#686868]">One-time payment for the full {BRAND.durationDays}-day workshop.</p>
            <div className="mt-6 flex flex-col gap-3">
              <Button asChild className="bg-brand-coral text-white hover:bg-brand-coral/90">
                <Link href="/register/google-form">Register using Google Form <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="border-green-700/40 text-green-700 hover:bg-green-700/5">
                <a href={BRAND.whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Phone className="mr-2 h-4 w-4" /> Join Our WhatsApp Group
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
