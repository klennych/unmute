'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { BRAND } from '@/lib/brand';

const CATEGORIES = [
  'Student',
  'Fresh Graduate',
  'Job Seeker',
  'Young Professional',
  'Other',
];

const schema = z.object({
  full_name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  category: z.string().min(1, 'Select a category'),
  batch_id: z.string().optional(),
  consent: z.boolean().refine((v) => v, 'You must accept the privacy policy'),
});

type FormValues = z.infer<typeof schema>;

interface BatchOption {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
}

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

export function WebsiteRegistrationForm({ batches }: { batches: BatchOption[] }) {
  const [submitting, setSubmitting] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (document.querySelector('script[src*="checkout.razorpay.com"]')) {
      setScriptReady(true);
      return;
    }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload = () => setScriptReady(true);
    document.body.appendChild(s);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      // Open Razorpay checkout
      openCheckout(data);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Registration error',
        description: (e as Error).message,
      });
      setSubmitting(false);
    }
  };

  const openCheckout = (reg: {
    registration_id: string;
    reference: string;
    order_id: string;
    amount: number;
    currency: string;
  }) => {
    if (!scriptReady || !window.Razorpay) {
      toast({ variant: 'destructive', title: 'Payment system not ready. Please retry.' });
      setSubmitting(false);
      return;
    }
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!keyId) {
      toast({ variant: 'destructive', title: 'Payment configuration missing.' });
      setSubmitting(false);
      return;
    }
    const rzp = new window.Razorpay({
      key: keyId,
      order_id: reg.order_id,
      amount: reg.amount,
      currency: reg.currency,
      name: BRAND.name,
      description: BRAND.workshop,
      prefill: {},
      theme: { color: '#171D36' },
      handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        // Verify on server
        try {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              registration_id: reg.registration_id,
              reference: reg.reference,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.verified) {
            router.push(`/payment/success?ref=${reg.reference}`);
          } else {
            router.push(`/payment/failed?ref=${reg.reference}`);
          }
        } catch {
          router.push(`/payment/failed?ref=${reg.reference}`);
        }
      },
      modal: {
        ondismiss: () => {
          toast({ title: 'Payment cancelled', description: 'You can retry payment anytime.' });
          router.push(`/payment/failed?ref=${reg.reference}`);
        },
      },
    });
    rzp.open();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="full_name">Full name</Label>
          <Input id="full_name" {...register('full_name')} placeholder="Your full name" />
          {errors.full_name && <p className="text-xs text-destructive">{errors.full_name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" type="email" {...register('email')} placeholder="you@example.com" />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <Input id="phone" {...register('phone')} placeholder="10-digit mobile" maxLength={10} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Participant category</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
        </div>
      </div>

      {batches.length > 0 && (
        <div className="space-y-1.5">
          <Label htmlFor="batch">Select batch (optional)</Label>
          <Controller
            control={control}
            name="batch_id"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="batch">
                  <SelectValue placeholder="Choose a batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name} ({b.start_date} to {b.end_date})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      )}

      <div className="flex items-start gap-2">
        <Controller
          control={control}
          name="consent"
          render={({ field }) => (
            <Checkbox
              id="consent"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="consent" className="text-sm font-normal text-[#686868]">
          I agree to the{' '}
          <Link href="/privacy-policy" className="font-medium text-brand-coral underline">Privacy Policy</Link> and{' '}
          <Link href="/terms" className="font-medium text-brand-coral underline">Terms</Link>.
        </Label>
      </div>
      {errors.consent && <p className="text-xs text-destructive">{errors.consent.message}</p>}

      <div className="rounded-xl border border-brand-beige bg-brand-ivory/50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#686868]">{BRAND.workshop}</span>
          <span className="font-heading text-xl font-bold text-brand-navy">₹{BRAND.fee}</span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={submitting}
        size="lg"
        className="w-full bg-brand-coral text-white hover:bg-brand-coral/90"
      >
        {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
        Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </form>
  );
}