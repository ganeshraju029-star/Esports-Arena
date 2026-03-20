import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();
    
    // Mock refresh token validation
    if (refreshToken && refreshToken.startsWith('mock_refresh_token_')) {
      return NextResponse.json({
        token: 'mock_jwt_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now()
      });
    } else {
      return NextResponse.json({
        status: 'fail',
        message: 'Invalid refresh token'
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Token refresh failed'
    }, { status: 500 });
  }
}
