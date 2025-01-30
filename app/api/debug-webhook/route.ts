import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    console.log('Webhook received:', req.method, req.url);
    return NextResponse.json({ received: true })
}