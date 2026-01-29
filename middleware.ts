import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Use Node.js runtime to avoid edge runtime crypto issues
export const runtime = "nodejs";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  const isRegisterPage = req.nextUrl.pathname === "/admin/register";
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

  // Allow API auth routes
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Allow login and register pages when not logged in
  if (isLoginPage || isRegisterPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  // Protect admin routes
  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
