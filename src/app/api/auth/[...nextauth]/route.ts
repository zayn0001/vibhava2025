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
      if (account?.provider === "google") {
        
        token.email = profile?.email;
        if (token.email) {
          const { data: user } = await supabaseAdmin
            .from("vibhava_users")
            .select("*")
            .eq("email", token.email)
            .single();
  
          token.role = user?.role
          token.id = user?.id
          token.name  = user?.name
        }
        
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        const { data: existingUser, error: _ } = await supabaseAdmin
          .from("vibhava_users")
          .select("*")
          .eq("email", session.user.email)
          .single();
        session.user.role = existingUser.role
        session.user.id = existingUser.id
        session.user.name = existingUser.name
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
