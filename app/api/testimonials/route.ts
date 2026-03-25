import { NextRequest, NextResponse } from 'next/server';

interface TestimonialRequest {
  name: string;
  roleCompany?: string;
  content: string;
  email?: string;
  website?: string;
  rating?: number;
}

interface BackendTestimonialPayload {
  name: string;
  // Matches backend Pydantic model AddTestimonial
  email: string | null;
  role: string | null;
  company: string | null;
  content: string;
  avatar_url: string | null;
  rating: number | null;
}

export async function GET() {
  try {
    const backendPath = `http://${process.env.HETZNER_POSTGRES_HOST}:8000/testimonials`;
    console.log('[testimonials][GET] Backend path:', backendPath);

    const response = await fetch(backendPath, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[testimonials][GET] Backend error:', response.status, errorText);
      return NextResponse.json(
        { error: errorText || `Backend returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('[testimonials][GET] Proxy failure:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch testimonials.' },
      { status: 500 }
    );
  }
}

function normalizeOptional(value?: string): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function splitRoleCompany(value?: string): { role: string | null; company: string | null } {
  if (!value) return { role: null, company: null };
  const v = value.trim();
  // Common pattern: "Role at Company"
  const atMatch = v.match(/^(.*?)\s+at\s+(.*)$/i);
  if (atMatch) {
    return { role: atMatch[1].trim() || null, company: atMatch[2].trim() || null };
  }
  // fallback: try splitting by comma
  const commaMatch = v.split(',').map((s) => s.trim()).filter(Boolean);
  if (commaMatch.length >= 2) {
    return { role: commaMatch.slice(0, -1).join(', '), company: commaMatch.slice(-1)[0] };
  }
  // otherwise put entire value in `role`
  return { role: v || null, company: null };
}

export async function POST(req: NextRequest) {
  try {
    const payload: TestimonialRequest = await req.json();

    const name = payload.name?.trim();
    const content = payload.content?.trim();

    if (!name || !content) {
      return NextResponse.json(
        { error: 'Name and testimonial are required.' },
        { status: 400 }
      );
    }

    // Honeypot field: likely bot traffic.
    if (payload.website && payload.website.trim().length > 0) {
      return NextResponse.json(
        { error: 'Spam submission rejected.' },
        { status: 400 }
      );
    }

    // Validate rating when provided
    let rating: number | null = null;
    if (typeof payload.rating !== 'undefined' && payload.rating !== null) {
      const parsed = Number(payload.rating);
      if (Number.isNaN(parsed) || parsed < 1 || parsed > 5) {
        return NextResponse.json({ error: 'Rating must be a number between 1 and 5.' }, { status: 400 });
      }
      rating = Math.round(parsed);
    }

    const { role, company } = splitRoleCompany(normalizeOptional(payload.roleCompany) ?? undefined);

    const backendPayload: BackendTestimonialPayload = {
      name,
      email: normalizeOptional(payload.email)?.toLowerCase() || null,
      role,
      company,
      content,
      avatar_url: null,
      rating,
    };

    const response = await fetch(`http://${process.env.HETZNER_POSTGRES_HOST}:8000/testimonials`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HEADER_AUTHORIZATION}`,
      },
      body: JSON.stringify(backendPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Backend returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(
      {
        success: true,
        message: 'Testimonial submitted successfully.',
        data,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to submit testimonial.' },
      { status: 500 }
    );
  }
}
