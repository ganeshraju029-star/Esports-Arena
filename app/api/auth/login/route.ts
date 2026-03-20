import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Mock authentication - replace with real auth logic
    if (email && password) {
      const mockUser = {
        id: '123',
        username: email.split('@')[0],
        email: email,
        role: 'player',
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
        gameIDs: { 
          freeFire: 'FF123456789', 
          pubg: 'PUBG987654', 
          freeFireLevel: 45, 
          pubgLevel: 62 
        },
        profile: { 
          displayName: 'Test User', 
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
    } else {
      return NextResponse.json({
        status: 'fail',
        message: 'Email and password are required'
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Internal server error'
    }, { status: 500 });
  }
}
