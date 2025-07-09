const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

module.exports.createOrder = async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `order_rcptid_${Math.floor(Math.random() * 10000)}`
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating Razorpay order");
  }
};