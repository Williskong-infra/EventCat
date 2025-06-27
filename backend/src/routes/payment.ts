import { Router } from 'express';
import Stripe from 'stripe';
import { auth } from '../middleware/auth';
import asyncHandler from '../utils/asyncHandler';

const router = Router();
const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) throw new Error('STRIPE_SECRET_KEY not set');
const stripe = new Stripe(stripeSecret);

router.post('/create-intent', auth, asyncHandler(async (req, res) => {
  let { amount, currency } = req.body;
  const safeAmount: number = Number(amount);
  if (!safeAmount || isNaN(safeAmount) || safeAmount <= 0) {
    return res.status(400).json({ error: 'Invalid or missing amount' });
  }
  const safeCurrency: string = (typeof currency === 'string' && currency.trim()) ? currency : 'hkd';
  const paymentIntent = await stripe.paymentIntents.create({
    amount: safeAmount, // in cents
    currency: safeCurrency, // always a string
    metadata: { userId: req.userId }
  });
  res.json({ clientSecret: paymentIntent.client_secret });
}));

export default router; 