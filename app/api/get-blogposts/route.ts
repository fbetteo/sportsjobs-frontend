// app/api/get-jobs/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.AIRTABLE_TOKEN ?? '' }).base(process.env.AIRTABLE_BASE ?? '');

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  // here I can put any filter. None so far

  // try {
  //   const records = await base('jobs')
  //     .select({ view: 'Grid view', maxRecords: limit, sort: [{ field: 'creation_date', direction: 'desc' }] })
  //     .all();

  let filterFormula = '';

// Filter EXample
//   if (country) {
//     filterFormula += `AND({country} = '${country}')`;
//   }




  try {
    const records = await base('blog')
      .select({
        view: 'Grid view',
        maxRecords: limit,
        // sort: [{ field: 'creation_date', direction: 'desc' }],
        filterByFormula: filterFormula ? `AND(${filterFormula})` : '',
      })
      .all();

      const blogposts = records.map((blogpost) => {
          return {
              id: blogpost.id,
              title: blogpost.get('Title'),
              content: blogpost.get('content'),
              content_image: blogpost.get('content_image'),
              short_description: blogpost.get('short_description'),
              cover: blogpost.get('cover'),
            old_blog_post_url22: blogpost.get('blog_post_url'),
              new_post_date: blogpost.get('post_date'),
          };
        
      });
    

    return NextResponse.json({ blogposts });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
