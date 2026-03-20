import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const game = searchParams.get('game');
    const mode = searchParams.get('mode');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Mock tournaments data
    let tournaments = [
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
      },
      {
        _id: '3',
        title: 'Solo Survival League',
        game: 'freefire',
        mode: 'solo',
        entryFee: 50,
        prizePool: 2500,
        maxPlayers: 75,
        joinedPlayers: [],
        status: 'upcoming',
        schedule: {
          tournamentStart: new Date(Date.now() + 259200000).toISOString()
        },
        isJoined: false,
        canJoin: true
      }
    ];

    // Apply filters
    if (game && game !== 'all') {
      tournaments = tournaments.filter(t => t.game === game);
    }
    if (mode && mode !== 'all') {
      tournaments = tournaments.filter(t => t.mode === mode);
    }
    if (status && status !== 'all') {
      tournaments = tournaments.filter(t => t.status === status);
    }
    if (search) {
      tournaments = tournaments.filter(t => 
        t.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    return NextResponse.json({
      status: 'success',
      data: {
        tournaments,
        total: tournaments.length
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch tournaments'
    }, { status: 500 });
  }
}
