import Link from 'next/link';
import {
  ArrowRight,
  CalendarDays,
  MessageCircle,
  Mic,
  Users,
  Phone,
  CheckCircle2,
  BookOpen,
  Sparkles,
  MessagesSquare,
  PersonStanding,
  UserRound,
  GraduationCap,
  Briefcase,
  HeartHandshake,
} from 'lucide-react';
import { BRAND } from '@/lib/brand';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import WavyBackground from '@/components/ui/blue-meshy-background';
import ChromaticText from '@/components/ui/bjork-chromatic-text';

const HERO_IMAGE =
  'https://images.pexels.com/photos/8518732/pexels-photo-8518732.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

const OVERVIEW = [
  { icon: CalendarDays, label: 'Duration', value: '14 Days' },
  { icon: Mic, label: 'Fee', value: `₹${BRAND.fee}` },
  { icon: Users, label: 'Format', value: 'Speaking & group practice' },
  { icon: MessagesSquare, label: 'Activities', value: 'Speaking Practice & Group Interaction' },
];

const PRACTISE = [
  { icon: MessageCircle, title: 'Everyday Conversations', desc: 'Practise real, day-to-day dialogue with confidence.' },
  { icon: Sparkles, title: 'Fluency & Clarity', desc: 'Express your thoughts smoothly and clearly.' },
  { icon: PersonStanding, title: 'Overcoming Hesitation', desc: 'Break the habit of holding back your voice.' },
  { icon: UserRound, title: 'Self-Introductions & Interviews', desc: 'Introduce yourself and handle interviews with ease.' },
  { icon: Users, title: 'Group Discussions', desc: 'Take part in group conversations comfortably.' },
  { icon: Mic, title: 'Interactive Speaking Activities', desc: 'Learn by speaking in a supportive environment.' },
];

const JOURNEY = [
  {
    stage: '01',
    title: 'Build your foundation',
    desc: 'Understand the basics of confident communication and start finding your voice.',
  },
  {
    stage: '02',
    title: 'Practise and express yourself',
    desc: 'Practise everyday conversations, fluency, and self-expression in a safe space.',
  },
  {
    stage: '03',
    title: 'Apply your skills in speaking activities',
    desc: 'Take part in group discussions, interviews, and interactive speaking tasks.',
  },
];

const AUDIENCE = [
  { icon: GraduationCap, label: 'Students' },
  { icon: GraduationCap, label: 'Fresh Graduates' },
  { icon: Briefcase, label: 'Job Seekers' },
  { icon: Users, label: 'Young Professionals' },
  { icon: HeartHandshake, label: 'Anyone who wants to improve' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section>
        <WavyBackground className="bg-brand-navy">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div className="animate-fade-in-up">
            <p className="eyebrow">Communication &amp; Speaking Confidence</p>
            <h1 className="mt-3 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-brand-ivory sm:text-5xl text-balance">
              14 Days to a More Confident You!
            </h1>
            <p className="mt-4 font-serif text-xl italic text-brand-ivory">
              Stop hesitating. Start speaking. Be heard.
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-ivory/90">
              Build everyday speaking confidence through 14 days of supportive practice.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="bg-brand-coral text-white hover:bg-brand-coral/90">
                <Link href="/register/google-form">
                  Register for ₹{BRAND.fee} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-brand-ivory bg-brand-ivory text-brand-navy hover:bg-brand-ivory/90 hover:text-brand-navy">
                <Link href="/workshop">Explore the Workshop</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center gap-5 text-sm text-brand-ivory/80">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-brand-coral" /> {BRAND.durationDays} days
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-brand-coral" /> Just ₹{BRAND.fee}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-brand-ivory/25 shadow-sm">
              <img
                src={HERO_IMAGE}
                alt="Two young adults engaged in a friendly conversation"
                className="h-[420px] w-full object-cover md:h-[480px]"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-brand-ivory/15 bg-brand-navy px-5 py-4 text-brand-ivory shadow-lg md:block">
              <p className="text-2xl font-bold">{BRAND.durationDays}</p>
              <p className="text-xs uppercase tracking-wider text-brand-ivory/70">Days of Practice</p>
            </div>
          </div>
        </div>
        </WavyBackground>
      </section>

      {/* Workshop overview */}
      <section className="bg-white py-14">
        <div className="container-page">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {OVERVIEW.map((o) => (
              <Card key={o.label} className="border-brand-beige bg-brand-ivory/50">
                <CardContent className="flex flex-col items-start gap-3 p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-brand-coral">
                    <o.icon className="h-5 w-5" />
                  </span>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#686868]">{o.label}</p>
                  <p className="font-heading text-lg font-bold text-brand-navy">{o.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* What you'll practise */}
      <section className="bg-brand-ivory py-16">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">What You&apos;ll Practise</p>
            <h2 className="section-title mt-2">Skills you&apos;ll build over 14 days</h2>
            <p className="mt-3 text-[#686868]">
              Practical, everyday speaking skills you can use right away.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRACTISE.map((p) => (
              <Card key={p.title} className="border-brand-beige bg-white">
                <CardContent className="p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-coral/10 text-brand-coral">
                    <p.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-bold text-brand-navy">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#686868]">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Learning journey */}
      <section className="bg-white py-16">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Learning Journey</p>
            <h2 className="section-title mt-2">Three stages to a confident voice</h2>
            <p className="mt-3 text-[#686868]">
              A general outline of how the workshop unfolds. The session-by-session
              curriculum will be shared once confirmed.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {JOURNEY.map((j) => (
              <div key={j.stage} className="relative rounded-xl border border-brand-beige bg-brand-ivory/50 p-6">
                <span className="font-heading text-3xl font-extrabold text-brand-coral/40">{j.stage}</span>
                <h3 className="mt-3 font-heading text-lg font-bold text-brand-navy">{j.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#686868]">{j.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline" className="border-brand-navy/30 text-brand-navy hover:bg-brand-navy/5">
              <Link href="/learning-journey">See the full learning journey <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Who can join */}
      <section className="bg-brand-ivory py-16">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Who Can Join?</p>
            <h2 className="section-title mt-2">Built for anyone who wants to speak up</h2>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {AUDIENCE.map((a) => (
              <span key={a.label} className="flex items-center gap-2 rounded-full border border-brand-beige bg-white px-5 py-2.5 text-sm font-medium text-brand-navy">
                <a.icon className="h-4 w-4 text-brand-coral" /> {a.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Registration section */}
      <section className="bg-white py-16">
        <div className="container-page">
          <div className="rounded-2xl border border-brand-beige bg-brand-ivory/60 p-8 sm:p-12">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <p className="eyebrow">Registration</p>
                <h2 className="section-title mt-2">Ready to Find Your Voice?</h2>
                <p className="mt-3 max-w-md text-[#686868]">
                  Join the {BRAND.durationDays}-day workshop for just ₹{BRAND.fee}. Register
                  through our Google Form.
                </p>
                <ul className="mt-5 space-y-2 text-sm text-brand-navy">
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-coral" /> ₹{BRAND.fee} one-time fee</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-coral" /> {BRAND.durationDays} days of guided practice</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-brand-coral" /> Simple Google Form registration</li>
                </ul>
              </div>
              <div className="flex flex-col gap-3">
                <Button asChild size="lg" className="bg-brand-coral text-white hover:bg-brand-coral/90">
                  <Link href="/register/google-form">Register using Google Form <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-green-700/40 text-green-700 hover:bg-green-700/5">
                  <a href={BRAND.whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Phone className="mr-2 h-4 w-4" /> Join Our WhatsApp Group
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-brand-navy py-16">
        <div className="container-page text-center">
          <h2 aria-label="Small Steps. Big Changes." className="font-heading text-3xl font-extrabold text-brand-ivory sm:text-4xl">
            <ChromaticText
              text="Small Steps. Big Changes."
              ariaLabel="Small Steps. Big Changes."
              color="#F6F3EB"
              background="#171D36"
              tone="dark"
              fontSize={46}
              fontWeight={800}
              pulseOnMount
              className="mx-auto max-w-4xl"
            />
          </h2>
          <div className="mt-4 font-serif text-xl italic text-brand-coral">
            <ChromaticText
              text={BRAND.message}
              ariaLabel={BRAND.message}
              color="#E87569"
              background="#171D36"
              tone="dark"
              fontSize={22}
              fontWeight={500}
              fontFamily="Georgia, serif"
              className="mx-auto max-w-3xl"
            />
          </div>
          <div className="mt-7">
            <Button asChild size="lg" className="bg-brand-coral text-white hover:bg-brand-coral/90">
              <Link href="/register/google-form">Register Now <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
