import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_ROUTES = ["/login", "/register", "/"];

async function getPayload(token) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

function redirectByRole(role, req) {
  const path = role === "ADMIN" ? "/admin" : `/users/${role.toLowerCase()}`;
  return NextResponse.redirect(new URL(path, req.url));
}

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (PUBLIC_ROUTES.includes(pathname)) {
    if (!token) return NextResponse.next();
    try {
      const payload = await getPayload(token);
      return redirectByRole(payload.role, req);
    } catch {
      return NextResponse.next();
    }
  }

  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    const payload = await getPayload(token);
    if (pathname.startsWith("/admin") && payload.role !== "ADMIN") return NextResponse.redirect(new URL("/login", req.url));
    if (pathname.startsWith("/users") && payload.role === "ADMIN") return redirectByRole(payload.role, req);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|public|api).*)"],
};