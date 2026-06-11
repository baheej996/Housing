import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Prevent Next.js from caching this API route
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get('tab');
  const url = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

  if (!url) {
    console.error("CRITICAL: NEXT_PUBLIC_GOOGLE_SCRIPT_URL is missing in environment variables!");
    return NextResponse.json({ error: 'Configuration missing' }, { status: 500 });
  }

  try {
    console.log(`Server fetching tab: ${tab}`);
    const response = await fetch(`${url}?tab=${tab}`, { cache: 'no-store' });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error.message);
    return NextResponse.json({ error: 'Failed to fetch from Google' }, { status: 500 });
  }
}

export async function POST(request) {
  const url = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

  if (!url) {
    return NextResponse.json({ error: 'Configuration missing' }, { status: 500 });
  }

  try {
    const body = await request.json();
    console.log(`Server posting to tab: ${body.tab}`);
    
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const result = await response.text();
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Post error:", error.message);
    return NextResponse.json({ error: 'Failed to post to Google' }, { status: 500 });
  }
}
