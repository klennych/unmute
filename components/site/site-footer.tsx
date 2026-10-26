import Link from 'next/link';
import { Phone, Mail } from 'lucide-react';
import { BRAND, NAV_LINKS } from '@/lib/brand';
import { BrandLockup } from '@/components/site/brand-lockup';

export function SiteFooter() {
  return (
    <footer className="bg-black text-brand-ivory">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center" aria-label={`${BRAND.name} home`}>
              <BrandLockup inverse />
            </Link>
            <p className="mt-4 max-w-sm text-sm text-brand-ivory/70">
              {BRAND.tagline}. {BRAND.message}
            </p>
            <p className="mt-4 text-sm text-brand-ivory/60">
              {BRAND.workshop} &middot; ₹{BRAND.fee}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-coral">
              Explore
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-brand-ivory/75 hover:text-brand-ivory">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-brand-coral">
              Contact
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-brand-ivory/75">
              <li>
                <a href={`tel:+91${BRAND.phones[0]}`} className="flex items-center gap-2 hover:text-brand-ivory">
                  <Phone className="h-4 w-4" /> +91 {BRAND.phones[0]}
                </a>
              </li>
              <li>
                <a href={`tel:+91${BRAND.phones[1]}`} className="flex items-center gap-2 hover:text-brand-ivory">
                  <Phone className="h-4 w-4" /> +91 {BRAND.phones[1]}
                </a>
              </li>
              <li>
                <a href={`mailto:${BRAND.contactEmails.join(',')}`} className="flex items-center gap-2 hover:text-brand-ivory">
                  <Mail className="h-4 w-4" /> {BRAND.contactEmails.join(' / ')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-brand-ivory/15 pt-6 text-xs text-brand-ivory/60 sm:flex-row sm:items-center">
          <p>
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="hover:text-brand-ivory">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-ivory">Terms</Link>
            <Link href="/refund-policy" className="hover:text-brand-ivory">Refund Policy</Link>
            <Link href="/faqs" className="hover:text-brand-ivory">FAQs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
