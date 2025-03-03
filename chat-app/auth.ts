import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { createUser } from "./server_components/service/form/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async () => {
        // return user object with their profile data
        return await createUser();
      },
    }),
  ],
  // pages: {
  //   signIn: "/signin",
  // },
});
