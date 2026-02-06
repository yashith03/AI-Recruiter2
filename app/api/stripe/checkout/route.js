// app/api/stripe/checkout/route.js

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/services/supabaseServer";
export async function POST(req) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      console.error('Missing STRIPE_SECRET_KEY during build/runtime');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }
    const stripe = new Stripe(stripeKey);
    const { priceId, mode, userEmail } = await req.json();

    if (!priceId || !mode || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getSupabaseServer();

    // 1. Get or create Stripe Customer ID
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("stripe_customer_id, name")
      .eq("email", userEmail)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        name: user.name,
        metadata: {
            supabase_email: userEmail
        }
      });
      customerId = customer.id;

      // Update user with customer ID
      await supabase
        .from("users")
        .update({ stripe_customer_id: customerId })
        .eq("email", userEmail);
    }

    // 2. Create Checkout Session
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode, // 'subscription' or 'payment'
      success_url: `${origin}/billing?success=true`,
      cancel_url: `${origin}/billing?canceled=true`,
      metadata: {
        userEmail: userEmail,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
