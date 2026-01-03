import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance only if keys are provided
const razorpay = (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && 
                  process.env.RAZORPAY_KEY_ID !== 'rzp_test_YOUR_KEY_ID')
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

export interface RazorpayOrderOptions {
  amount: number; // in paise (multiply by 100)
  currency?: string;
  receipt: string;
  notes?: any;
}

// Create Razorpay order
export const createRazorpayOrder = async (options: RazorpayOrderOptions) => {
  try {
    if (!razorpay) {
      throw new Error('Razorpay is not configured. Please add valid API keys.');
    }
    const order = await razorpay.orders.create({
      amount: options.amount,
      currency: options.currency || 'INR',
      receipt: options.receipt,
      notes: options.notes,
    });

    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    };
  } catch (error: any) {
    throw new Error(`Razorpay order creation failed: ${error.message}`);
  }
};

// Verify Razorpay payment signature
export const verifyRazorpaySignature = (
  orderId: string,
  paymentId: string,
  signature: string
): boolean => {
  try {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return generatedSignature === signature;
  } catch (error) {
    return false;
  }
};

// Fetch payment details
export const fetchPaymentDetails = async (paymentId: string) => {
  try {
    if (!razorpay) {
      throw new Error('Razorpay is not configured. Please add valid API keys.');
    }
    const payment = await razorpay.payments.fetch(paymentId);
    return {
      success: true,
      payment,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch payment details: ${error.message}`);
  }
};

// Create refund
export const createRefund = async (paymentId: string, amount?: number) => {
  try {
    if (!razorpay) {
      throw new Error('Razorpay is not configured. Please add valid API keys.');
    }
    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount, // Optional: partial refund
    });

    return {
      success: true,
      refundId: refund.id,
      amount: refund.amount,
      status: refund.status,
    };
  } catch (error: any) {
    throw new Error(`Refund creation failed: ${error.message}`);
  }
};

export default razorpay;
