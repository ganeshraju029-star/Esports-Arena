# Esports Arena - Tournament Platform

A comprehensive esports tournament platform for Free Fire and PUBG Mobile with integrated frontend and backend.

## 🚀 Features

### Core Features
- ✅ **Tournament Management**: Create, join, and manage tournaments
- ✅ **User Authentication**: Secure login/registration with JWT tokens
- ✅ **Wallet System**: Add funds via Razorpay, track balance and transactions
- ✅ **Real-time Updates**: Socket.io integration for live notifications
- ✅ **Dashboard**: User stats, tournaments, and wallet management
- ✅ **Admin Panel**: Complete admin dashboard for tournament management

### Technical Features
- ✅ **Integrated Server**: Single Next.js server with API routes
- ✅ **Payment Integration**: Real Razorpay payment processing
- ✅ **Responsive Design**: Works on all devices
- ✅ **TypeScript**: Full type safety
- ✅ **Modern UI**: Beautiful dark theme with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI components
- **Socket.io Client** - Real-time updates

### Backend (Integrated)
- **Next.js API Routes** - Backend API
- **JWT Authentication** - Secure auth
- **Razorpay** - Payment processing
- **Socket.io** - Real-time communication

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ganeshraju029-star/Esports-Arena.git
   cd Esports-Arena
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 🌐 Deployment

### Netlify Deployment

1. **Push to GitHub** (Already done)
   ```bash
   git push origin master
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select "Esports-Arena" repository

3. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **Environment Variables**
   - Set `NEXT_PUBLIC_RAZORPAY_KEY_ID` in Netlify environment variables

5. **Deploy**
   - Click "Deploy site"
   - Your site will be live at a random Netlify URL

### Vercel Deployment (Alternative)

1. **Push to GitHub**
   ```bash
   git push origin master
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Deploy

## 🔧 Configuration

### Environment Variables

Create `.env.local` file:

```env
# API Configuration
NEXT_PUBLIC_API_URL=/api

# Socket.io Configuration  
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ

# Frontend URL
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### Production Environment Variables (Netlify)

In Netlify dashboard → Site settings → Environment variables:

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_actual_razorpay_key_id
```

## 📱 Usage

### For Players
1. **Register**: Create an account with game IDs
2. **Login**: Access your dashboard
3. **Browse Tournaments**: Find tournaments to join
4. **Add Funds**: Use Razorpay to add money to wallet
5. **Join Tournaments**: Pay entry fees and compete
6. **Track Progress**: View stats and earnings

### For Admins
1. **Login**: Use admin credentials
2. **Create Tournaments**: Set up new tournaments
3. **Manage Players**: View and manage participants
4. **Monitor Payments**: Track transactions
5. **Update Results**: Add match results and winners

## 🎮 Game Support

### Free Fire
- UID support
- Level tracking
- Tournament integration

### PUBG Mobile  
- ID support
- Level tracking
- Tournament integration

## 💳 Payment Integration

### Razorpay Features
- ✅ UPI (Google Pay, PhonePe, Paytm)
- ✅ Credit/Debit Cards
- ✅ NetBanking
- ✅ Digital Wallets
- ✅ EMI Options

### Payment Flow
1. User enters amount
2. Create Razorpay order
3. Open payment modal
4. Complete payment
5. Verify signature
6. Update wallet balance

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Token refresh mechanism
- ✅ Input validation
- ✅ Payment signature verification
- ✅ CORS protection
- ✅ Environment variable protection

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh

### Tournaments
- `GET /api/tournaments` - Get tournaments
- `GET /api/tournaments/featured` - Featured tournaments
- `POST /api/tournaments/join` - Join tournament

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

### Users
- `GET /api/users/stats` - User statistics
- `GET /api/users/tournaments` - User tournaments

## 🐛 Troubleshooting

### Common Issues

1. **404 Error on Netlify**
   - Check `netlify.toml` configuration
   - Ensure `next.config.js` is properly configured
   - Verify build command is `npm run build`

2. **Payment Not Working**
   - Check Razorpay key ID
   - Ensure script is loaded
   - Check API endpoints

3. **Login Issues**
   - Check API endpoints
   - Verify JWT configuration
   - Check localStorage

### Debug Mode

Enable debug mode by adding to `.env.local`:
```env
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

---

**Built with ❤️ for the esports community**
