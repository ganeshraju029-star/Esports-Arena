import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  try {
    // Mock user tournaments
    const userTournaments: any[] = [];

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
