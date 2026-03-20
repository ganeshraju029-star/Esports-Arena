import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    
    // Mock order creation - in production, integrate with Razorpay
    const orderId = 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    return NextResponse.json({
      status: 'success',
      data: {
        orderId: orderId,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
        amount: amount * 100, // Convert to paise
        currency: 'INR'
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to create payment order'
    }, { status: 500 });
  }
}
