// app/api/stripe/webhook/route.js

import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/services/supabaseServer";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook Signature Verification Failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const supabase = getSupabaseServer();

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const userEmail = session.metadata.userEmail;
      const amount = session.amount_total / 100;
      const currency = session.currency;
      const type = session.mode === "subscription" ? "subscription" : "credits";
      const plan = session.mode === "subscription" ? "Monthly" : "Credit Pack"; // Simple mapping for now

      console.log(`✅ Payment successful for ${userEmail}: ${amount} ${currency}`);

      // 1. Update User Data
      const updateData = {
        subscription_status: "Active",
        subscription_plan: plan,
      };

      // If it's a credit purchase, we might want to add credits
      // (This logic depends on how you define your products in Stripe metadata)
      if (type === "credits") {
        // Logic to add credits based on specific product or metadata
        // For example: 
        // updateData.credits = supabase.sql`credits + 50`; // Need to use proper increment logic
      }

      const { error: userUpdateError } = await supabase
        .from("users")
        .update(updateData)
        .eq("email", userEmail);

      if (userUpdateError) {
        console.error("User Update Error (Webhook):", userUpdateError);
      }

      // 2. Insert into Payments table
      const { error: paymentError } = await supabase
        .from("payments")
        .insert([{
          user_id: userEmail, // Assuming we use email as join if that's what's in users table
          stripe_session_id: session.id,
          amount: amount,
          currency: currency,
          type: type,
          status: "Paid",
          created_at: new Date().toISOString(),
        }]);

      if (paymentError) {
        console.error("Payment Record Error (Webhook):", paymentError);
      }
      break;

    case "invoice.payment_succeeded":
      // Handle recurring subscription payments
      break;

    case "customer.subscription.deleted":
      // Handle cancellation
      const subscription = event.data.object;
      // Find user by stripe_customer_id and set status to 'Cancelled'
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

// Next.js config for webhooks to handle raw body
export const config = {
  api: {
    bodyParser: false,
  },
};
