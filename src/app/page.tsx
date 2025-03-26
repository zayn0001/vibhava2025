"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  // Redirect user based on role after login
  useEffect(() => {
    if (session?.user?.role === "admin") {
      router.push("/admin");
    } else if (session?.user?.role === "player") {
      router.push("/dashboard");
    }
  }, [session, router]);

  const handleSignIn = async () => {
    const result = await signIn("google");
    if (result?.error) {
      alert("Sign-in failed!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-xl font-semibold">Sign in to continue</h2>
      <button
        onClick={handleSignIn}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Sign in with Google
      </button>
    </div>
  );
}
