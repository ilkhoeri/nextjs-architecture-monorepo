import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import authConfig from '@/auth/config';
import { SIGNIN_REDIRECT, SIGNIN_ROUTE, API_PREFIX, AUTH_ROUTES, PUBLIC_ROUTES } from './routes';

import type { Session } from 'next-auth';
import type { NextRequest } from 'next/server';
interface NextAuthRequest extends NextRequest {
  auth: Session | null;
}

const { auth } = NextAuth(authConfig);

const allowedOrigins = [
  // List origin
  process.env.NEXT_PUBLIC_FRONTEND_URL!
].filter(Boolean); // Filter out undefined values;

export default auth((req: NextAuthRequest) => {
  const { pathname, search } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');

  // Helper functions
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route));
  const isApiRoute = pathname.startsWith(API_PREFIX);
  const isAllowedOrigin = origin ? allowedOrigins.includes(origin) : false;

  // Cek apakah ini request internal
  const isInternalRequest = !origin || origin === req.nextUrl.origin || referer?.startsWith(req.nextUrl.origin);

  // 1. Handle CORS Preflight (OPTIONS) requests first
  if (req.method === 'OPTIONS') {
    return handlePreflightRequest(origin, isAllowedOrigin);
  }

  // 2. Handle API routes
  if (isApiRoute) {
    return handleApiRequest(req, isInternalRequest, isPublicRoute, origin, isAllowedOrigin);
  }

  // 3. Handle Auth routes (sign-in, sign-up, etc.)
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(SIGNIN_REDIRECT, req.nextUrl));
    }
    return addCorsHeaders(NextResponse.next(), origin, isAllowedOrigin);
  }

  // 4. Handle protected routes
  if (!isLoggedIn && !isPublicRoute) {
    return redirectToSignIn(req, pathname, search);
  }

  // 5. Default: allow request with CORS headers if needed
  return addCorsHeaders(NextResponse.next(), origin, isAllowedOrigin);
});

// Helper functions
function handlePreflightRequest(origin: string | null, isAllowedOrigin: boolean) {
  const response = new NextResponse(null, { status: 204 });

  if (isAllowedOrigin && origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  return response;
}

function handleApiRequest(req: NextAuthRequest, isInternalRequest: boolean | undefined, isPublicRoute: boolean, origin: string | null, isAllowedOrigin: boolean) {
  // Internal requests: allow all API access
  if (isInternalRequest) {
    return NextResponse.next();
  }

  // External requests: check if endpoint is public
  if (!isPublicRoute) {
    return NextResponse.json({ error: 'Access denied', message: 'This API endpoint is not publicly accessible' }, { status: 403 });
  }

  // Public endpoint: add CORS headers and continue
  return addCorsHeaders(NextResponse.next(), origin, isAllowedOrigin);
}

function addCorsHeaders(response: NextResponse, origin: string | null, isAllowedOrigin: boolean) {
  if (isAllowedOrigin && origin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  return response;
}

function redirectToSignIn(req: NextAuthRequest, pathname: string, search: string) {
  let callbackUrl = pathname;
  if (search) {
    callbackUrl += search;
  }

  const encoded = encodeURIComponent(callbackUrl);
  const shouldAddCallback = encoded !== encodeURIComponent(SIGNIN_REDIRECT);
  const redirectUrl = shouldAddCallback ? `${SIGNIN_ROUTE}?callbackUrl=${encoded}` : SIGNIN_ROUTE;

  return NextResponse.redirect(new URL(redirectUrl, req.nextUrl));
}

export const config = {
  matcher: [
    // Jalankan pada semua route kecuali:
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.[\\w]+$).*)',
    '/auth/:path*',
    '/api/:path*'
  ]
  // matcher: [
  //   // Skip Next.js internals and all static files, unless found in search params
  //   '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
  //   // Always run for API routes
  //   '/(api|trpc)(.*)'
  // ]
};
