import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock user tournaments
    const userTournaments = [];

    return NextResponse.json({
      status: 'success',
      data: {
        tournaments: userTournaments
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch user tournaments'
    }, { status: 500 });
  }
}
