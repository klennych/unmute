import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { generateReference } from '@/lib/reference';

const schema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  category: z.string().max(60).optional(),
  batch_id: z.string().uuid().optional(),
  consent: z.literal(true),
});

export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // Check workshop registration is open
    const { data: workshop } = await supabaseAdmin
      .from('workshops')
      .select('id, fee_paise, currency, registration_open, is_active')
      .eq('is_active', true)
      .maybeSingle();
    if (!workshop || !workshop.registration_open || !workshop.is_active) {
      return NextResponse.json({ error: 'Registration is currently closed.' }, { status: 403 });
    }

    // Validate batch if provided
    if (data.batch_id) {
      const { data: batch } = await supabaseAdmin
        .from('batches')
        .select('id, registration_open, is_published')
        .eq('id', data.batch_id)
        .maybeSingle();
      if (!batch || !batch.is_published || !batch.registration_open) {
        return NextResponse.json({ error: 'Selected batch is not available.' }, { status: 400 });
      }
    }

    // Duplicate check (same email + same active workshop pending/paid registration)
    const { data: existing } = await supabaseAdmin
      .from('registrations')
      .select('id, payment_status')
      .eq('email', data.email.toLowerCase())
      .in('payment_status', ['pending', 'paid'])
      .maybeSingle();
    if (existing) {
      return NextResponse.json(
        { error: 'You already have an active registration with this email.' },
        { status: 409 }
      );
    }

    // Create pending registration with unique reference
    let reference = '';
    let insertOk = false;
    let registration: Record<string, unknown> | null = null;
    for (let attempt = 0; attempt < 5; attempt++) {
      reference = generateReference();
      const { data: row, error } = await supabaseAdmin
        .from('registrations')
        .insert({
          reference,
          full_name: data.full_name,
          email: data.email.toLowerCase(),
          phone: data.phone,
          category: data.category || null,
          batch_id: data.batch_id || null,
          registration_method: 'website',
          payment_status: 'pending',
          participation_status: 'registered',
          consent_accepted: true,
        })
        .select()
        .single();
      if (!error) {
        insertOk = true;
        registration = row;
        break;
      }
      if (error.code !== '23505') {
        return NextResponse.json({ error: 'Could not create registration.' }, { status: 500 });
      }
    }
    if (!insertOk || !registration) {
      return NextResponse.json({ error: 'Could not generate registration reference.' }, { status: 500 });
    }

    // Create Razorpay order (test mode compatible)
    const orderId = await createRazorpayOrder(workshop.fee_paise, workshop.currency);

    // Save payment record
    const idempotencyKey = `reg-${registration.id}-${Date.now()}`;
    await supabaseAdmin.from('payments').insert({
      registration_id: registration.id,
      razorpay_order_id: orderId,
      amount_paise: workshop.fee_paise,
      currency: workshop.currency,
      status: 'created',
      idempotency_key: idempotencyKey,
    });

    return NextResponse.json({
      registration_id: registration.id,
      reference,
      order_id: orderId,
      amount: workshop.fee_paise,
      currency: workshop.currency,
    });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

async function createRazorpayOrder(amountPaise: number, currency: string): Promise<string> {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured');
  }
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency,
      payment_capture: 1,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Razorpay order creation failed: ${txt}`);
  }
  const data = await res.json();
  return data.id as string;
}
