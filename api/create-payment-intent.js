import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { amount } = req.body;

      // Crea el PaymentIntent con el monto especificado
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe procesa en centavos
        currency: 'usd',
        description: 'Donación - Emergencia Terremoto Venezuela',
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}