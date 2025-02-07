import { fetchBlogPostDetails } from '@/lib/fetchBlogPostDetails';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean); // Remove empty strings
    
    // Get the last part of the path and extract the ID after the last hyphen
    const lastPart = pathParts[pathParts.length - 1];
    const matches = lastPart.match(/[-\s]([a-zA-Z0-9]{17})$/);
    const blogpostId = matches ? matches[1] : null;

    if (!blogpostId) {
      console.error('No valid blogpost ID found in URL:', url.pathname);
      return NextResponse.redirect('https://www.sportsjobs.online/blog', 301);
    }

    const blogpost = await fetchBlogPostDetails(blogpostId);

    if (blogpost) {
      return NextResponse.redirect(`https://www.sportsjobs.online/blogposts/${blogpost.id}`, 301);
    } else {
      console.error('Blog post not found for ID:', blogpostId);
      return NextResponse.redirect('https://www.sportsjobs.online/blog', 301);
    }
  } catch (error) {
    console.error('Error processing blog post redirect:', error);
    return NextResponse.redirect('https://www.sportsjobs.online/', 301);
  }
}