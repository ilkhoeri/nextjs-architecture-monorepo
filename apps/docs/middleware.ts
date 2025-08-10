import { i18nRouter } from 'next-i18n-router';
import { NextRequest } from 'next/server';
import { i18n } from './i18n';

export function middleware(request: NextRequest) {
  // const nextUrl = request.nextUrl;
  // if (nextUrl.pathname === "/daftar" || nextUrl.pathname === "/registrasi") {
  // return NextResponse.rewrite(new URL("https://psb.ppannur.ponpes.id", request.url)); // return new URL https://ppannur.ponpes.id/daftar
  // }
  const { pathname } = request.nextUrl;

  // Skip i18n middleware for Next.js internal routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.') // Skip files with extensions
  ) {
    return;
  }

  return i18nRouter(request, i18n);
}

// export const config = {
//   matcher: "/((?!api|static|.*\\..*|_next).*)"
// };

export const config = {
  // Only run middleware on specific paths
  matcher: [
    // Skip all internal paths (_next, api, assets, etc.)
    '/((?!_next/static|_next/image|favicon.ico|assets|api).*)',
    // Include root path
    '/',
    // Include locale paths
    '/(id|en)/:path*'
  ]
};
