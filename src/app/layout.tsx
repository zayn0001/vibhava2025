"use client";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Navbar Component
function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="w-full bg-gray-900 text-white py-4 px-6 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <div className="text-xl font-bold">
          <Link href="/" className="hover:text-gray-300">
            Vibhava
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="hover:text-gray-300">
            Dashboard
          </Link>

          {/* Show /admin only if user is an admin */}
          {session?.user?.role === "admin" && (
            <Link href="/admin" className="hover:text-gray-300">
              Admin
            </Link>
          )}

          {/* Show Sign Out if signed in */}
          {session?.user ? (
            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href=""
              onClick={()=>signIn("google")}
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// RootLayout Component
export default function RootLayout({
  children}: Readonly<{
    
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="bg-gray-100">
          {/* Navbar on all pages */}
          <Navbar />
          <main className="container mx-auto p-4">{children}</main>
        </body>
      </html>
    </SessionProvider>
  );
}
