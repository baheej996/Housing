import { NextResponse } from 'next/server';

export async function POST(request) {
  const { password } = await request.json();
  const correctPassword = process.env.ADMIN_PASSWORD;

  if (password === correctPassword) {
    const response = NextResponse.json({ success: true });
    
    // Set a cookie that expires in 24 hours
    response.cookies.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    
    return response;
  }

  return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
}
