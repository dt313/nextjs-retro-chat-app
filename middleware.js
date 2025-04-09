import { NextResponse } from 'next/server';

export function middleware(request) {
    // console.log('middleware');
    if (request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/search', request.url));
    }
}

// Specify the paths where the middleware should run
export const config = {
    matcher: ['/'],
};
