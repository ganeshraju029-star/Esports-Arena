import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, type } = await request.json();
    
    // Mock payment verification - in production, verify actual Razorpay signature
    if (razorpay_order_id && razorpay_payment_id) {
      return NextResponse.json({
        status: 'success',
        data: {
          message: 'Payment verified successfully',
          transactionId: 'txn_' + Date.now(),
          amount: 1000, // Mock amount
          type: type || 'wallet_deposit'
        }
      });
    } else {
      return NextResponse.json({
        status: 'fail',
        message: 'Invalid payment details'
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Payment verification failed'
    }, { status: 500 });
  }
}
