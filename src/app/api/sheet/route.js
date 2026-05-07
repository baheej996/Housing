import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tab = searchParams.get('tab');
  const url = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

  try {
    const response = await fetch(`${url}?tab=${tab}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(request) {
  const body = await request.json();
  const url = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    const result = await response.text();
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post' }, { status: 500 });
  }
}
