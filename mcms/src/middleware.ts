import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("token")?.value;

  console.log("hello");

  // If user is NOT authenticated, redirect to login
  if (!accessToken) {
    console.log(`${req.nextUrl.pathname}end`);
    return NextResponse.redirect(new URL("/log_in", req.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"],
};
