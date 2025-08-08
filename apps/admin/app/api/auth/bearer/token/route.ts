import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/get-user';

const SECRET = process.env.AUTH_SECRET; // Pastikan ini sama dengan secret NextAuth

export async function GET(req: NextRequest) {
  const [currentUser, token] = await Promise.all([getCurrentUser(), getToken({ req, secret: SECRET })]);

  if (!currentUser || !token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  console.log('JWT Token (Server-side):', token); // Token ini adalah objek JWT, bukan string mentah
  // Untuk mendapatkan string token mentah yang dikirim oleh klien, perlu mengakses header Authorization
  const authHeader = req.headers.get('authorization');
  const rawToken = authHeader?.split(' ')[1]; // Ambil bagian setelah 'Bearer '

  // ... logika API

  return NextResponse.json(token);
}
