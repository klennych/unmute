import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-ivory px-6 text-center">
      <p className="font-heading text-7xl font-extrabold text-brand-coral">404</p>
      <h1 className="mt-4 font-heading text-2xl font-bold text-brand-navy">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-2 max-w-md text-[#686868]">
        The page you&apos;re looking for may have moved or never existed. Let&apos;s get
        you back on track.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild className="bg-brand-coral text-white hover:bg-brand-coral/90">
          <Link href="/"><Home className="mr-2 h-4 w-4" /> Back to Home</Link>
        </Button>
        <Button asChild variant="outline" className="border-brand-navy/30 text-brand-navy hover:bg-brand-navy/5">
          <Link href="/contact"><ArrowLeft className="mr-2 h-4 w-4" /> Contact Support</Link>
        </Button>
      </div>
    </div>
  );
}
