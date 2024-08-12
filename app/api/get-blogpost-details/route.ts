
import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN ?? '' }).base(process.env.AIRTABLE_BASE ?? '');

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id') ?? '';

  try {
      const record = await base('blog').find(id);

      const blogpost=   {
        id: record.id,
        title: record.get('Title'),
        content: record.get('content'),
        content_image: record.get('content_image'),
        short_description: record.get('short_description'),
        cover: record.get('cover'),
        old_blog_post_url: record.get('blog_post_url'),
        new_post_date: record.get('post_date'),
    };

    return NextResponse.json({ blogpost });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
