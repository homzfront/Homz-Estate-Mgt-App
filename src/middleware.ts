/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("accessToken")?.value;
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
};

export const config = {
    matcher: [
        "/admin/dashboard/:path*",
        "/admin/dashboard",
        "/admin/estates/:path*",
        "/admin/users/:path*",
        "/admin/transactions/:path*",
        "/admin/wallets/:path*",
        "/admin/security/:path*",
        "/admin/reports/:path*",
        "/admin/subscriptions/:path*",
        "/admin/support/:path*",
        "/admin/admin-mgt/:path*",
        "/admin/kyc/:path*",
        "/admin/activity/:path*",
        "/dashboard/:path*",
        "/dashboard",
        "/access-control/:path*",
        "/access-control",
        "/add-estate/:path*",
        "/add-estate",
        "/estate-info/:path*",
        "/estate-info",
        "/manage-resident/:path*",
        "/manage-resident",
        "/profile/:path*",
        "/profile",
        "/support/:path*",
        "/support",
        "/settings/:path*",
        "/settings",
        // "/resident",
        "/resident/dashboard/:path*",
        "/resident/dashboard",
        "/resident/profile/:path*",
        "/resident/profile",
        "/resident/estate-info/:path*",
        "/resident/estate-info",
        "/resident/visitor-access/:path*",
        "/resident/visitor-access",
    ],
};