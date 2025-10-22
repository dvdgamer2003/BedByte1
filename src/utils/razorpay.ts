import api from './api';

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export interface PaymentOptions {
  appointmentId?: string;
  bookingId?: string;
  amount: number;
  description: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (error: string) => void;
}

export const initiatePayment = async (options: PaymentOptions) => {
  try {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      options.onFailure('Failed to load Razorpay SDK');
      return;
    }

    // Create payment order
    const orderResponse = await api.post('/payments/order', {
      appointmentId: options.appointmentId,
      bookingId: options.bookingId,
      amount: options.amount,
      description: options.description,
    });

    const { orderId, amount, currency, key, paymentId } = orderResponse.data.data;

    // Razorpay options
    const razorpayOptions = {
      key: key,
      amount: amount,
      currency: currency,
      name: 'GetBeds+',
      description: options.description,
      order_id: orderId,
      handler: async function (response: any) {
        try {
          // Verify payment on backend
          await api.post('/payments/verify', {
            paymentId: paymentId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          options.onSuccess(paymentId);
        } catch (error: any) {
          options.onFailure(error.response?.data?.error || 'Payment verification failed');
        }
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      theme: {
        color: '#2563eb',
      },
      modal: {
        ondismiss: function () {
          options.onFailure('Payment cancelled by user');
        },
      },
    };

    // Open Razorpay checkout
    const razorpay = new (window as any).Razorpay(razorpayOptions);
    razorpay.open();
  } catch (error: any) {
    options.onFailure(error.response?.data?.error || 'Failed to initiate payment');
  }
};

// Request refund
export const requestRefund = async (paymentId: string, reason: string) => {
  try {
    const response = await api.post(`/payments/${paymentId}/refund`, { reason });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to process refund',
    };
  }
};
