import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();

  // Add additional security headers that might not be in next.config.js
  const headers = response.headers;

  headers.set("X-DNS-Prefetch-Control", "off");
  headers.set("X-Download-Options", "noopen");
  headers.set("X-Permitted-Cross-Domain-Policies", "none");

  // Add custom security logic
  const requestHeaders = new Headers(request.headers);
  const userAgent = requestHeaders.get("user-agent") || "";

  // Block suspicious user agents
  if (userAgent.includes("suspicious-bot")) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
