import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

// Server-side Stripe client
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
}

// Client-side Stripe loader (singleton)
let stripePromise: ReturnType<typeof loadStripe>;
export function getStripeClient() {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
  if (!stripePromise) stripePromise = loadStripe(key);
  return stripePromise;
}
