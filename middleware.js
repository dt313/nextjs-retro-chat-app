import { NextResponse } from 'next/server';

export function middleware(request) {
    // console.log('middleware');
    // if (request.nextUrl.pathname === '/computer' || request.nextUrl.pathname === '/') {
    //     return NextResponse.redirect(new URL('/dashboard', request.url));
    // }
}

// Specify the paths where the middleware should run
export const config = {
    // matcher: ['/computer', '/'],
};
