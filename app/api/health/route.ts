import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Esports Arena API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
