import React from 'react';

const RazorpayButton = ({ amount, onSuccess, onError, requestId }) => {
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      onError('Razorpay SDK failed to load');
      return;
    }

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
      amount: amount * 100,
      currency: 'INR',
      name: 'CareConnect',
      description: `Donation for Request #${requestId}`,
      image: '/logo192.png',
      handler: function (response) { onSuccess(response); },
      prefill: { name: 'Donor Name', email: 'donor@example.com', contact: '9999999999' },
      notes: { requestId },
      theme: { color: '#3B82F6' }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response) { onError(response.error.description); });
    rzp.open();
  };

  return (
    <button onClick={handlePayment} className="w-full btn-primary flex items-center justify-center">
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
      Pay ₹{amount} with Razorpay
    </button>
  );
};

export default RazorpayButton;


