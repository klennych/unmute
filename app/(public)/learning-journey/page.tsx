import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { BRAND } from '@/lib/brand';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Learning Journey',
  description:
    'Three stages of the UNMUTE DUO workshop: build your foundation, practise self-expression, and apply your skills in speaking activities.',
};

const STAGES = [
  {
    stage: '01',
    title: 'Build your foundation',
    desc: 'Understand the basics of confident communication and start finding your voice.',
    topics: [
      'Why we hesitate — and how to work past it',
      'Posture, breath, and a calm speaking voice',
      'Simple introductions that feel like you',
    ],
  },
  {
    stage: '02',
    title: 'Practise and express yourself',
    desc: 'Practise everyday conversations, fluency, and self-expression in a safe space.',
    topics: [
      'Everyday conversations and small talk',
      'Organising your thoughts before you speak',
      'Speaking clearly without rushing',
    ],
  },
  {
    stage: '03',
    title: 'Apply your skills in speaking activities',
    desc: 'Take part in group discussions, interviews, and interactive speaking tasks.',
    topics: [
      'Group discussions and turn-taking',
      'Interview-style speaking practice',
      'Interactive speaking activities and feedback',
    ],
  },
];

export default function LearningJourneyPage() {
  return (
    <div className="bg-brand-ivory">
      <section className="container-page py-14 md:py-20">
        <div className="max-w-3xl">
          <p className="eyebrow">Learning Journey</p>
          <h1 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl">
            How your 14 days unfold
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-[#292929]/80">
            This is a general outline of the learning experience. The session-by-session
            curriculum will be shared once it is confirmed by the organizers.
          </p>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container-page space-y-6">
          {STAGES.map((s) => (
            <div key={s.stage} className="rounded-2xl border border-brand-beige bg-brand-ivory/50 p-8">
              <div className="flex items-start gap-5">
                <span className="font-heading text-4xl font-extrabold text-brand-coral/40">{s.stage}</span>
                <div className="flex-1">
                  <h2 className="font-heading text-xl font-bold text-brand-navy">{s.title}</h2>
                  <p className="mt-1 text-sm text-[#686868]">{s.desc}</p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                    {s.topics.map((t) => (
                      <li key={t} className="rounded-lg border border-brand-beige bg-white px-3 py-2 text-sm text-brand-navy">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-14 text-center">
        <Button asChild className="bg-brand-coral text-white hover:bg-brand-coral/90">
          <Link href="/register/google-form">Register for ₹{BRAND.fee} <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
        <p className="mt-3 text-sm text-[#686868]">{BRAND.workshop} &middot; {BRAND.message}</p>
      </section>
    </div>
  );
}
