import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./lib/zod";
import { ZodError } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          let user = null;

            const { email, password } = await signInSchema.parseAsync(
              credentials
            );

          user = { id: "1", email: "John Doe", password: "1o1901901930" }; // Added 'id' field to match the User type

          console.log("🚀 ~ authorize ~ user:", user);
          if (!user) {
            throw new Error("Invalid credentials");
          }
          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
          throw error; // Re-throw other errors
        }
      },
    }),
  ],
});
