import Link from 'next/link';
import { ArrowRight, Mic, Heart, Target, Users } from 'lucide-react';
import { BRAND } from '@/lib/brand';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'About UNMUTE DUO',
  description:
    'UNMUTE DUO helps young adults build speaking confidence through guided practice, supportive feedback, and real conversations.',
};

const VALUES = [
  { icon: Heart, title: 'Supportive by design', desc: 'A safe space to make mistakes, try again, and grow.' },
  { icon: Target, title: 'Practice over theory', desc: 'You learn to speak by speaking — every single day.' },
  { icon: Users, title: 'Two voices, one purpose', desc: 'You learn alongside peers who want the same thing: to be heard.' },
];

export default function AboutPage() {
  return (
    <div className="bg-brand-ivory">
      <section className="container-page py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="eyebrow">About UNMUTE DUO</p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
            We help people find their voice.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[#292929]/80">
            {BRAND.name} began with a simple belief: most people don&apos;t need more
            theory about communication — they need a place to practise. We created a
            14-day workshop where hesitation is normal and speaking up is celebrated.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-[#292929]/80">
            {BRAND.tagline}. Whether you stumble over introductions or freeze in group
            discussions, our workshop gives you steady, supportive practice until
            speaking feels like second nature.
          </p>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-xl border border-brand-beige bg-brand-ivory/50 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-navy text-brand-coral">
                  <v.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-heading text-lg font-bold text-brand-navy">{v.title}</h2>
                <p className="mt-2 text-sm text-[#686868]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-navy text-brand-coral">
          <Mic className="h-7 w-7" />
        </span>
        <h2 className="mt-5 font-heading text-3xl font-extrabold text-brand-navy">{BRAND.message}</h2>
        <div className="mt-7">
          <Button asChild className="bg-brand-coral text-white hover:bg-brand-coral/90">
            <Link href="/register/google-form">Register for ₹{BRAND.fee} <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
