const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

const products = {
  "orthopedic-bed": { price: 5200, name: "Orthopedic Bed" },
  "royal-collar": { price: 3250, name: "Royal Collar" },
  "memory-mat": { price: 3750, name: "Memory Mat" },
  "stainless-bowl": { price: 2500, name: "Stainless Bowl" },
  "interactive-toy": { price: 4350, name: "Interactive Toy" },
  "couch-cover": { price: 4900, name: "Couch Cover" }
};

app.get('/health', (req, res) => {
  res.json({ status: "OK" });
});

app.post('/calculate-shipping', (req, res) => {
  const { items } = req.body;
  if (!items || items.length === 0) return res.json({ shipping: 0 });
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const shipping = 4.69 + (totalItems - 1) * 2.20;
  res.json({ shipping: parseFloat(shipping.toFixed(2)) });
});

app.post('/create-checkout-session', async (req, res) => {
  const { items, customer_email } = req.body;
  
  const line_items = items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: { name: products[item.id].name },
      unit_amount: products[item.id].price,
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer_email,
      automatic_tax: { enabled: true },
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});