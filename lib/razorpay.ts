interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color: string;
  };
  handler: (response: any) => void;
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
    handleback?: boolean;
    confirmclose?: boolean;
    external?: boolean;
    animate?: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export class RazorpayService {
  private key: string;

  constructor() {
    this.key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1234567890';
  }

  loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay script'));
      document.body.appendChild(script);
    });
  }

  async createOrder(options: RazorpayOptions): Promise<any> {
    await this.loadScript();

    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        key: this.key,
        amount: options.amount,
        currency: options.currency || 'INR',
        name: options.name || 'Esports Arena',
        description: options.description || 'Payment',
        order_id: options.order_id,
        prefill: options.prefill,
        theme: {
          color: options.theme?.color || '#4F46E5',
          ...options.theme,
        },
        handler: (response: any) => {
          resolve(response);
        },
        modal: {
          ondismiss: () => {
            reject(new Error('Payment cancelled by user'));
          },
          escape: true,
          backdropclose: true,
          handleback: true,
          confirmclose: true,
          external: false,
          animate: 'slideFromBottom',
          ...options.modal,
        },
      });

      rzp.on('payment.failed', (response: any) => {
        reject(new Error(response.error.description || 'Payment failed'));
      });

      rzp.open();
    });
  }

  async createWalletOrder(amount: number, userData?: any): Promise<any> {
    const options: RazorpayOptions = {
      key: this.key,
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      name: 'Esports Arena',
      description: `Add ₹${amount} to wallet`,
      prefill: userData ? {
        name: userData.displayName || userData.username,
        email: userData.email,
      } : undefined,
      handler: (response) => {
        return response;
      },
    };

    return this.createOrder(options);
  }

  async createTournamentEntryOrder(
    amount: number,
    tournamentTitle: string,
    userData?: any
  ): Promise<any> {
    const options: RazorpayOptions = {
      key: this.key,
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      name: 'Esports Arena',
      description: `Entry fee for ${tournamentTitle}`,
      prefill: userData ? {
        name: userData.displayName || userData.username,
        email: userData.email,
      } : undefined,
      handler: (response) => {
        return response;
      },
    };

    return this.createOrder(options);
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 100000; // Max 1 lakh
  }
}

export const razorpayService = new RazorpayService();
