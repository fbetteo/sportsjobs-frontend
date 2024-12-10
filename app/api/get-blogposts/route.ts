import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const airtableId = searchParams.get('airtable_id');

  const requestBody = {
    limit,
    filters: airtableId ? { airtable_id: airtableId } : null,
    sort_by: "creation_date",
    sort_direction: "desc"
  };

  try {
    const response = await fetch(`http://${process.env.HETZNER_POSTGRES_HOST}:8000/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ blogposts: data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}