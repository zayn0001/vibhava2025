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
          .select("*")
          .eq("email", profile.email)
          .single();

        // Add user details to the token
        token.id = user?.id;
        token.email = user?.email;
        token.name = user?.name;
        token.role = user?.role || "user"; // Fallback to 'user'
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // Assign values from token to session
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },

    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const { email, name } = user;

        const { data: existingUser} = await supabaseAdmin
          .from("vibhava_users")
          .select("*")
          .eq("email", email)
          .single();

        if (!existingUser) {

          const { error: insertError } = await supabaseAdmin
            .from("vibhava_users")
            .insert({
              email,
              name
            });

          if (insertError) {
            console.error("Error inserting into vibhava_users:", insertError.message);
            return false;
          }
        }
      }
      return true;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});

export { handler as GET, handler as POST };
