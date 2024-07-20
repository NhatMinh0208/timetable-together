import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/app/lib/zod";
import { authUser, getUser } from "@/app/lib/actions";
import { User } from "@/app/lib/types";
import { ZodError, string } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user: User | null = null;

          const { email, password } =
            await signInSchema.parseAsync(credentials);

          // logic to verify if user exists
          user = await authUser(email, password);
          // return user object with the their profile data
          return user;
        } catch (error) {
          // console.log(error);
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          } else {
            return null;
          }
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user && user.id) {
        // User is available during sign-in
        token.picture = user.id;
      }
      return token;
    },
    session({ session, token }) {
      const id: string = token.picture ? token.picture : "";
      return {
        user: {
          name: session.user.name,
          email: session.user.email,
          id: id,
        },
        expires: session.expires,
      };
    },
  },
});
