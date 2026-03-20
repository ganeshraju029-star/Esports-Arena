import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock featured tournaments
    const featuredTournaments = [
      {
        _id: '1',
        title: 'Free Fire Championship',
        game: 'freefire',
        mode: 'squad',
        entryFee: 0,
        prizePool: 5000,
        maxPlayers: 100,
        joinedPlayers: [],
        status: 'upcoming',
        schedule: {
          tournamentStart: new Date(Date.now() + 86400000).toISOString()
        },
        isJoined: false,
        canJoin: true
      },
      {
        _id: '2',
        title: 'PUBG Elite Showdown',
        game: 'pubg',
        mode: 'solo',
        entryFee: 100,
        prizePool: 10000,
        maxPlayers: 50,
        joinedPlayers: [],
        status: 'upcoming',
        schedule: {
          tournamentStart: new Date(Date.now() + 172800000).toISOString()
        },
        isJoined: false,
        canJoin: true
      }
    ];

    return NextResponse.json({
      status: 'success',
      data: {
        tournaments: featuredTournaments
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch featured tournaments'
    }, { status: 500 });
  }
}
