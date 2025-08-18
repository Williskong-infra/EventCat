import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCart } from '../context/CartContext';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51ReWjUEIoMEFFiNMCePrdu5CWeSvtNGwis0BARluwbNwcEdcuzOnnfz3vbLyuKu5Eq3vilKoGOcsG1miANRV1oqv00UKUjmOvk');

const RealPaymentForm: React.FC<{ total: number }> = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart, fetchCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: 'if_required'
    });
    if (error) {
      setMessage(error.message || 'Payment failed');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      const token = localStorage.getItem('token');
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await clearCart();
      await fetchCart();
      setMessage('Payment successful! Order created.');
    } else {
      setMessage('Payment processing...');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 16, fontWeight: 600 }}>
        Total: HK$ {total}
      </div>
      <PaymentElement />
      <button type="submit" disabled={!stripe || loading} style={{ marginTop: 16 }}>
        {loading ? 'Processing...' : 'Pay'}
      </button>
      {message && <div style={{ marginTop: 16 }}>{message}</div>}
    </form>
  );
};

const Payment: React.FC = () => {
  const { cart } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const total = cart
    ? cart.items.reduce((sum, item) => sum + (item.event.price ?? 0) * item.quantity, 0)
    : 0;

  useEffect(() => {
    if (!total) return;
    
    setLoading(true);
    setError('');
    
    console.log('Creating payment intent for amount:', total * 100);
    
    fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ amount: total * 100, currency: 'hkd' })
    })
      .then(res => {
        console.log('Payment intent response status:', res.status);
        if (!res.ok) {
          return res.json().then(err => {
            throw new Error(err.error || `HTTP ${res.status}`);
          });
        }
        return res.json();
      })
      .then(data => {
        console.log('Payment intent created:', data);
        setClientSecret(data.clientSecret);
      })
      .catch(err => {
        console.error('Payment intent error:', err);
        setError(err.message || 'Failed to create payment intent');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [total]);

  if (!cart || cart.items.length === 0) return <div>Your cart is empty.</div>;
  if (loading) return <div>Loading payment form...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!clientSecret) return <div>Failed to load payment form. Please try again.</div>;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <RealPaymentForm total={total} />
    </Elements>
  );
};

export default Payment; 