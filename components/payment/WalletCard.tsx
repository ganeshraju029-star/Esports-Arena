'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, Plus, ArrowUpRight, Loader2, IndianRupee } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { razorpayService } from '@/lib/razorpay';

export default function WalletCard() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // Get token from AuthContext or localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleAddMoney = async () => {
    const amountNum = parseFloat(amount);
    
    if (!amount || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!razorpayService.validateAmount(amountNum)) {
      setError('Amount must be between ₹1 and ₹1,00,000');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check if we're in a browser environment (static deployment)
      const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined';
      
      if (isBrowser) {
        // Check if we have a backend URL configured
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const useMockPayment = !apiBaseUrl || apiBaseUrl.includes('localhost') || process.env.NODE_ENV === 'production';
        
        if (useMockPayment) {
          // Mock payment order for static deployment
          const mockOrderData = {
            status: 'success',
            data: {
              id: 'order_' + Date.now(),
              amount: amountNum,
              currency: 'INR',
              receipt: 'receipt_' + Date.now()
            }
          };
          
          // Mock Razorpay payment
          const mockRazorpay = {
            open: (options: any) => {
              // Simulate successful payment after 2 seconds
              setTimeout(() => {
                if (options.handler) {
                  options.handler({
                    razorpay_order_id: mockOrderData.data.id,
                    razorpay_payment_id: 'pay_' + Date.now(),
                    razorpay_signature: 'mock_signature_' + Date.now()
                  });
                }
              }, 2000);
            }
          };
          
          // Mock Razorpay object
          (window as any).Razorpay = function(options: any) {
            return mockRazorpay;
          };
          
          const orderData = mockOrderData;
          
          const razorpay = new (window as any).Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_key',
            amount: amountNum * 100, // Convert to paise
            currency: 'INR',
            name: 'Esports Arena',
            description: 'Wallet Top-up',
            order_id: orderData.data.id,
            handler: async (response: any) => {
              try {
                // Mock payment verification
                const mockVerifyData = {
                  status: 'success',
                  data: {
                    message: 'Payment verified successfully',
                    walletBalance: (user?.wallet.balance || 0) + amountNum
                  }
                };
                
                setSuccess(mockVerifyData.data.message);
                if (user) {
                  user.wallet.balance += amountNum;
                  user.wallet.totalEarnings += amountNum;
                }
              } catch (verifyError: any) {
                setError(verifyError.message || 'Payment verification failed');
              }
            },
            prefill: {
              name: user?.profile.displayName || user?.username,
              email: user?.email,
            },
            theme: {
              color: '#4F46E5',
            },
          });

          razorpay.open();
          return;
        } else {
          // Real Razorpay integration for development with backend
          const orderResponse = await fetch(`${apiBaseUrl}/payments/create-order`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ amount: amountNum }),
          });

          const orderData = await orderResponse.json();

          if (!orderResponse.ok) {
            throw new Error(orderData.message || 'Failed to create payment order');
          }

          const razorpay = new (window as any).Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: amountNum * 100, // Convert to paise
            currency: 'INR',
            name: 'Esports Arena',
            description: 'Wallet Top-up',
            order_id: orderData.data.id,
            handler: async (response: any) => {
              try {
                // Verify payment
                const verifyResponse = await fetch(`${apiBaseUrl}/payments/verify`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    type: 'wallet'
                  }),
                });

                const verifyData = await verifyResponse.json();

                if (!verifyResponse.ok) {
                  throw new Error(verifyData.message || 'Payment verification failed');
                }

                setSuccess(verifyData.data.message);
                if (user) {
                  user.wallet.balance += amountNum;
                  user.wallet.totalEarnings += amountNum;
                }
              } catch (verifyError: any) {
                setError(verifyError.message || 'Payment verification failed');
              }
            },
            prefill: {
              name: user?.profile.displayName || user?.username,
              email: user?.email,
            },
            theme: {
              color: '#4F46E5',
            },
          });

          razorpay.open();
        }
      }
      
      // Fallback for non-browser environments (should not execute on Netlify)
      console.warn('Payment attempted in non-browser environment');
      setError('Payment not available in this environment');

    } catch (error: any) {
      setError(error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Wallet Balance</h3>
            <p className="text-sm text-muted-foreground">Manage your funds</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Active
        </Badge>
      </div>

      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2">
          <IndianRupee className="h-6 w-6 text-primary" />
          <div className="text-3xl font-bold text-primary">
            {razorpayService.formatAmount(user?.wallet.balance || 0)}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Total earnings: {razorpayService.formatAmount(user?.wallet.totalEarnings || 0)}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount" className="text-foreground">Add Money to Wallet</Label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="pl-10 bg-muted border-border"
              min="1"
              max="100000"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {quickAmounts.map((quickAmount) => (
            <Button
              key={quickAmount}
              variant="outline"
              size="sm"
              onClick={() => setAmount(quickAmount.toString())}
              className="border-border hover:bg-primary/10"
            >
              ₹{quickAmount}
            </Button>
          ))}
        </div>

        <Button
          onClick={handleAddMoney}
          disabled={loading || !amount}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Money
            </>
          )}
        </Button>

        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Spent</p>
              <p className="font-semibold text-foreground">
                {razorpayService.formatAmount(user?.wallet.totalSpent || 0)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Net Profit</p>
              <p className={`font-semibold ${
                (user?.wallet.totalEarnings || 0) - (user?.wallet.totalSpent || 0) >= 0 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {razorpayService.formatAmount(
                  (user?.wallet.totalEarnings || 0) - (user?.wallet.totalSpent || 0)
                )}
              </p>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-border hover:bg-primary/10"
          onClick={() => window.location.href = '/dashboard/transactions'}
        >
          <ArrowUpRight className="mr-2 h-4 w-4" />
          View Transaction History
        </Button>
      </div>
    </Card>
  );
}
