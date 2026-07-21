import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const response = await fetch(
      `http://${process.env.HETZNER_POSTGRES_HOST}:8000/add_alert`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`,
        },
        body: JSON.stringify(payload),
      }
    );

    let data: any;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const error = data?.detail || data?.error || `Alert service returned ${response.status}`;
      return NextResponse.json({ error }, { status: response.status });
    }

    return NextResponse.json(
      {
        error: '',
        alert: data?.record,
        duplicate: Boolean(data?.duplicate),
      },
      { status: data?.duplicate ? 200 : 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || 'Unable to create alert' },
      { status: 502 }
    );
  }
}
