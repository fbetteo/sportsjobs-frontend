import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id') ?? '';
  console.log('id:', id);
  const requestBody = {
    limit: 1,
    filters: { blog_id: id },
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
    console.log('data:', data);
    if (!data || data.length === 0) {
      throw new Error('Blog post not found');
    }

    return NextResponse.json({ blogpost: data[0] });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}