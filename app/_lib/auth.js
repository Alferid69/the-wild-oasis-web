import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { createGuest, getGuest } from "./data-service";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      // called whenever user tries to access the route specified in middleware
      // return auth?.user ? true : false;
      return !!auth?.user; // if user doesn't exist return false which will redirect to signin option
    },

    async signIn({ user, account, profile }) {
      // called after the user entered their credential and before they are logged in.
      try {
        const existingGuest = await getGuest(user.email);
        if (!existingGuest)
          await createGuest({ email: user.email, fullName: user.name });
        return true;
      } catch (error) {
        return false;
      }
    },

    async session({ session, user }) {
      // called after each signIn callback and when we call auth function
      // can't do this one in signin callback because session hasn't been created yet
      const guest = await getGuest(session.user.email);
      session.user.guestId = guest.id; // mutate session

      return session;
    },
  },
  pages: {
    signIn: "/login", // redirect whenever we click guest area instead of built in logger(googles)
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(authConfig); // the auth function can be used as middleware
