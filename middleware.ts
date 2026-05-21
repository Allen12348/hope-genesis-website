import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { resolveAuthSecret } from "@/lib/auth/secret";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isLogin = pathname === "/admin/login" || pathname.startsWith("/admin/login/");
  const secret = resolveAuthSecret();

  const token = await getToken({
    req,
    secret,
  });

  if (isLogin) {
    if (token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const login = new URL("/admin/login", req.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
