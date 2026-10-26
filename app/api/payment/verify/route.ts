import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSupabaseAdmin } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await req.json();
    const {
      registration_id,
      reference,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = body as {
      registration_id: string;
      reference: string;
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    };

    if (!registration_id || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ verified: false, error: 'Missing fields' }, { status: 400 });
    }

    // Find the payment record
    const { data: payment, error: paymentErr } = await supabaseAdmin
      .from('payments')
      .select('id, razorpay_order_id, status, amount_paise, registration_id')
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('registration_id', registration_id)
      .maybeSingle();
    if (paymentErr || !payment) {
      return NextResponse.json({ verified: false, error: 'Payment record not found' }, { status: 404 });
    }
    if (payment.status === 'paid') {
      return NextResponse.json({ verified: true, reference, already_paid: true });
    }

    // Verify signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ verified: false, error: 'Server misconfiguration' }, { status: 500 });
    }
    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      // Mark payment as failed
      await supabaseAdmin
        .from('payments')
        .update({ status: 'failed', razorpay_payment_id, updated_at: new Date().toISOString() })
        .eq('id', payment.id);
      return NextResponse.json({ verified: false, error: 'Invalid signature' }, { status: 400 });
    }

    // Signature valid — mark paid, update registration
    await supabaseAdmin
      .from('payments')
      .update({
        status: 'paid',
        razorpay_payment_id,
        updated_at: new Date().toISOString(),
        paid_at: new Date().toISOString(),
      })
      .eq('id', payment.id);

    await supabaseAdmin
      .from('registrations')
      .update({
        payment_status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('id', registration_id);

    return NextResponse.json({ verified: true, reference });
  } catch (err) {
    console.error('Payment verification error:', err);
    return NextResponse.json({ verified: false, error: 'Server error' }, { status: 500 });
  }
}
