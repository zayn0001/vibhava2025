// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    // Protect /admin route to allow only admin users
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Protect /dashboard route to allow only authenticated users
    if (pathname.startsWith("/dashboard") && !role) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    pages: {
      signIn: "/", // Redirect to home for login
    },
  }
);

// Define the protected routes
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
