'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { BRAND, NAV_LINKS } from '@/lib/brand';
import { BrandLockup } from '@/components/site/brand-lockup';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const panel = menuPanelRef.current;
    if (panel) {
      if (open) panel.removeAttribute('inert');
      else panel.setAttribute('inert', '');
    }

    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      menuButtonRef.current?.focus();
    };
  }, [open, mounted]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-beige bg-brand-ivory/95 backdrop-blur supports-[backdrop-filter]:bg-brand-ivory/80">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center" aria-label={`${BRAND.name} home`}>
          <BrandLockup />
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  active ? 'text-brand-coral' : 'text-brand-navy hover:text-brand-coral'
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Button asChild className="bg-brand-coral text-white hover:bg-brand-coral/90">
            <Link href="/register/google-form">Register for ₹{BRAND.fee}</Link>
          </Button>
        </div>

        <button
          ref={menuButtonRef}
          className="inline-flex items-center justify-center rounded-md p-2 text-brand-navy md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-controls="mobile-navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mounted && createPortal(<div
        className={cn(
          'fixed inset-0 z-[60] overflow-hidden transition-[visibility] duration-500 md:hidden',
          open ? 'visible delay-0' : 'invisible delay-500'
        )}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          className={cn(
            'absolute inset-0 h-full w-full bg-brand-navy/50 transition-opacity duration-300',
            open ? 'opacity-100' : 'opacity-0'
          )}
          aria-label="Close navigation menu"
          onClick={() => setOpen(false)}
        />
        <div
          ref={menuPanelRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={cn(
            'absolute inset-0 flex h-[100dvh] w-full max-w-none flex-col bg-brand-ivory shadow-2xl transition-transform duration-500 ease-out',
            open ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-brand-beige px-6">
            <Link
              href="/"
              aria-label={`${BRAND.name} home`}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
            >
              <BrandLockup />
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              tabIndex={open ? 0 : -1}
              className="rounded-md p-2 text-brand-navy transition-colors hover:bg-brand-beige/70"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="container-page flex flex-1 flex-col gap-1 overflow-y-auto py-5" aria-label="Mobile">
            {NAV_LINKS.map((l, index) => (
              <Link
                key={l.href}
                href={l.href}
                tabIndex={open ? 0 : -1}
                aria-current={pathname === l.href ? 'page' : undefined}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${100 + index * 65}ms` : '0ms' }}
                className={cn(
                  'transform self-start rounded-lg px-3 py-1.5 text-sm font-semibold leading-5 opacity-0 transition-all duration-300 ease-out',
                  open ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0',
                  pathname === l.href
                    ? 'bg-brand-navy text-brand-ivory'
                    : 'text-brand-navy hover:bg-brand-beige/60'
                )}
              >
                {l.label}
              </Link>
            ))}
            <div
              className={cn(
                'mt-2 transform opacity-0 transition-all duration-300 ease-out',
                open ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
              )}
              style={{ transitionDelay: open ? `${100 + NAV_LINKS.length * 65}ms` : '0ms' }}
            >
              <Button asChild size="sm" className="w-fit px-4 bg-brand-coral text-white hover:bg-brand-coral/90">
                <Link
                  href="/register/google-form"
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                >
                  Register for ₹{BRAND.fee}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>, document.body)}
    </header>
  );
}
