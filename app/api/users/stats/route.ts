import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  try {
    // Mock user stats
    const userStats = {
      stats: { 
        totalTournaments: 0, 
        totalWins: 0, 
        totalKills: 0, 
        totalPoints: 0 
      },
      wallet: { 
        balance: 1000, 
        totalEarnings: 1000, 
        totalSpent: 0 
      },
      recentMatches: [],
      tournamentStats: { 
        total: 0, 
        upcoming: 0, 
        completed: 0 
      },
      transactionStats: []
    };

    return NextResponse.json({
      status: 'success',
      data: userStats
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch user stats'
    }, { status: 500 });
  }
}
