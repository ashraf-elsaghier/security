import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();

  // Add additional security headers
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("X-Download-Options", "noopen");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");

  // Custom security logic
  const userAgent = request.headers.get("user-agent") || "";

  // Block suspicious user agents
  if (userAgent.includes("suspicious-bot")) {
    // Return a 403 with no body (allowed)
    return new NextResponse(null, { status: 403 });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
