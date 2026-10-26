import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase/server';

/**
 * Razorpay webhook endpoint.
 * Verifies the webhook signature, idempotently updates payment + registration.
 */
export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await req.text();
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    const signature = req.headers.get('x-razorpay-signature') || '';
    const expected = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');
    if (expected !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    const payload = event.payload?.payment?.entity;
    if (!payload) {
      return NextResponse.json({ received: true });
    }

    const orderId = payload.order_id;
    const paymentId = payload.id;
    const status = payload.status;
    const amount = payload.amount;
    const method = payload.method;

    // Idempotency: check if already processed by payment_id
    const { data: existing } = await supabaseAdmin
      .from('payments')
      .select('id, status')
      .eq('razorpay_payment_id', paymentId)
      .maybeSingle();
    if (existing && existing.status === 'paid') {
      return NextResponse.json({ received: true, duplicate: true });
    }

    // Find payment by order id
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('id, registration_id, status, amount_paise')
      .eq('razorpay_order_id', orderId)
      .maybeSingle();
    if (!payment) {
      return NextResponse.json({ received: true, no_payment: true });
    }

    // Validate amount
    if (amount !== payment.amount_paise) {
      console.error('Webhook amount mismatch', { expected: payment.amount_paise, got: amount });
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
    }

    if (status === 'captured' || status === 'paid') {
      if (payment.status !== 'paid') {
        await supabaseAdmin
          .from('payments')
          .update({
            status: 'paid',
            razorpay_payment_id: paymentId,
            method,
            updated_at: new Date().toISOString(),
            paid_at: new Date().toISOString(),
          })
          .eq('id', payment.id);
        await supabaseAdmin
          .from('registrations')
          .update({ payment_status: 'paid', updated_at: new Date().toISOString() })
          .eq('id', payment.registration_id);
      }
    } else if (status === 'failed') {
      await supabaseAdmin
        .from('payments')
        .update({
          status: 'failed',
          razorpay_payment_id: paymentId,
          method,
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.id);
      await supabaseAdmin
        .from('registrations')
        .update({ payment_status: 'failed', updated_at: new Date().toISOString() })
        .eq('id', payment.registration_id);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
