import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { COOKIE_REFRESH_TOKEN } from '@/constants/constatnts';
import { EUrl, NO_AUTH_URL } from '@/constants/urls.constants';
import axios, { isAxiosError } from 'axios';
import { IAuthResponse } from '@/types/auth.type';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const refreshToken = request.cookies.get(COOKIE_REFRESH_TOKEN)?.value;

    if (!refreshToken && !NO_AUTH_URL.some(url => pathname === url)) {
        return NextResponse.redirect(new URL(EUrl.LOGIN, request.url));
    } else if (NO_AUTH_URL.some(url => pathname === url)) {
        return NextResponse.next();
    } else {
        try {
            const res = (
                await axios.post<IAuthResponse>(
                    process.env.NEXT_PUBLIC_BACKEND_API_URL + 'auth/refresh',
                    {
                        refreshToken,
                    },
                )
            ).data;

            request.cookies.set(COOKIE_REFRESH_TOKEN, res.refreshToken);

            return NextResponse.next();
        } catch (err) {
            if (isAxiosError(err)) {
                console.log(err);
            }
        }
    }
}

export const config = {
    matcher: ['/((?!_next|static|favicon.ico|images|public).*)'],
};
