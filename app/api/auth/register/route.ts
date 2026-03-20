import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const role = formData.get('role') as string || 'player';
    
    const freeFire = formData.get('freeFire') as string;
    const pubg = formData.get('pubg') as string;
    const freeFireLevel = formData.get('freeFireLevel') as string;
    const pubgLevel = formData.get('pubgLevel') as string;

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json({
        status: 'fail',
        message: 'Please fill in all required fields'
      }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({
        status: 'fail',
        message: 'Passwords do not match'
      }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({
        status: 'fail',
        message: 'Password must be at least 6 characters long'
      }, { status: 400 });
    }

    // Mock user creation - replace with real database logic
    const mockUser = {
      id: Date.now().toString(),
      username: username,
      email: email,
      role: role,
      gameIDs: {
        freeFire: freeFire || undefined,
        pubg: pubg || undefined,
        freeFireLevel: freeFireLevel ? parseInt(freeFireLevel) : undefined,
        pubgLevel: pubgLevel ? parseInt(pubgLevel) : undefined,
      },
      wallet: { 
        balance: 1000, 
        totalEarnings: 1000, 
        totalSpent: 0 
      },
      stats: { 
        totalTournaments: 0, 
        totalWins: 0, 
        totalKills: 0, 
        totalPoints: 0 
      },
      profile: { 
        displayName: username, 
        avatar: null, 
        bio: '' 
      }
    };

    return NextResponse.json({
      status: 'success',
      data: {
        user: mockUser,
        token: 'mock_jwt_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now()
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Registration failed'
    }, { status: 500 });
  }
}
