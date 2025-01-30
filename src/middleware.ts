import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY || 'your-secret-key');

async function isTokenValid(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET_KEY);
    return true;
  } catch (err) {
    console.error('JWT validation failed', err);
    return false;
  }
}

async function authMiddleware(req: NextRequest): Promise<NextResponse | null> {
  const authToken = req.cookies.get('authToken')?.value;

  const url = new URL(req.url);
  const pathname = url.pathname;

  // Check if the path is root (e.g., "/", "/uk", "/en")
  const isRootPath = routing.locales.some((locale) => pathname === `/${locale}`) || pathname === '/';

  // Extract locale and path after locale
  const localeMatch = new RegExp(`^\\/(${routing.locales.join('|')})(\\/|$)`).exec(pathname);
  const locale = localeMatch ? localeMatch[1] : null;
  const pathAfterLocale = localeMatch ? pathname.slice(localeMatch[0].length) : '';
  
  const isUnprotected = unprotectedPaths.some((path) => pathAfterLocale.startsWith(path));
  
  if (isRootPath || isUnprotected) {
    return null; // Skip token validation for root and unprotected paths
  }

  // Validate the token
  if (!authToken || !(await isTokenValid(authToken))) {
    console.log(req.url, 'Unauthorized');
    return NextResponse.redirect(new URL(`/${locale || routing.defaultLocale}/login`, req.url));
  }

  return null; // Allow the request to proceed
}

export default async function middleware(req: NextRequest) {
  const authResult = await authMiddleware(req);

  if (authResult) {
    return authResult;
  }

  return createMiddleware(routing)(req);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(uk|en)/:path*'],
};

const unprotectedPaths = [
  'login', 
  'logout',
  'register',
  'installHook.js.map',
  'favicon.ico',
  'manifest.json',
  'robots.txt',
  'sitemap.xml',
  'favicon.ico'
];