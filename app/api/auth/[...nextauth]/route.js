export const dynamic = "force-dynamic";

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      console.log("Attempting sign-in with email:", profile.email);
      if (profile.email === "rufussweeney@gmail.com") {
        console.log("Sign-in successful");
        return true;
      }
      console.log("Sign-in failed");
      return false;
    },
    async session({ session, token }) {
      session.user.email = token.email;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
};

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };