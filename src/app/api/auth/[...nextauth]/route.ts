import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabaseAdmin } from "@/lib/supabase";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const { data: user } = await supabaseAdmin
          .from("vibhava_users")
          .select("id, role, name")
          .eq("email", profile.email)
          .single();

        if (user) {
          token.id = user.id;
          token.role = user.role;
          token.name = user.name;
        } else {
          // Insert new user if not exists
          const { error } = await supabaseAdmin
            .from("vibhava_users")
            .insert({ email: profile.email, name: profile.name });

          if (error) {
            console.error("Error inserting new user:", error.message);
          }
        }

        token.email = profile.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});

export { handler as GET, handler as POST };
