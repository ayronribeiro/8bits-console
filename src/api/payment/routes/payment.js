module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/payment/create-payment-intent',
      handler: 'payment.createPaymentIntent',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
}; 