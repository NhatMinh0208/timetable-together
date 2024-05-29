import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/app/lib/zod";
import { getUser } from "@/app/lib/actions";
import { User } from "./app/lib/types";
import { ZodError } from "zod";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: User & DefaultSession["user"];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
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
          user = await getUser(email, password);
          // return user object with the their profile data
          return user;
        } catch (error) {
          console.log(error);
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
});
