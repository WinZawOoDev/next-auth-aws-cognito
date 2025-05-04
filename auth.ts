import NextAuth, { CredentialsSignin, type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getOAuth2Token, initiateAuth } from "@/lib/auth/cognito-identity-client";

interface CognitoTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends CognitoTokens {
    user: {
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user pUSER_POOL_IDroperties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"],
  }


  interface User extends CognitoTokens { }

}

class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password"
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    newUser: '/register',
    signIn: '/login',
    signOut: '/logout',
  },
  providers: [
    Credentials({
      type: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "email",
          name: "email"
        },
        password: {
          label: "password",
          type: "password",
          name: "password"
        }
      },
      async authorize(credentials, request) {

        let authSession = {} as any;
        const { email, password, authorizationCode } = credentials as { email: string, password: string, authorizationCode: string };

        try {

          if (authorizationCode) {

            const oAuth2Response = await getOAuth2Token(authorizationCode as string);

            authSession.id = oAuth2Response?.access_token_payload.sub;
            authSession.name = oAuth2Response?.access_token_payload.username;
            authSession.email = oAuth2Response?.id_token_payload.email;
            authSession.accessToken = oAuth2Response?.access_token;
            authSession.idToken = oAuth2Response?.id_token;
            authSession.refreshToken = oAuth2Response?.refresh_token;

            return authSession;

          } else {

            const initiatedAuth = await initiateAuth({ email, password });

            if (!initiatedAuth) {
              throw new InvalidLoginError("Invalid credentials")
            }

            authSession.id = initiatedAuth?.AccessTokenPayload.sub;
            authSession.name = initiatedAuth?.AccessTokenPayload.username;
            authSession.email = initiatedAuth?.IdTokenPayload.email;
            authSession.accessToken = initiatedAuth?.AuthenticationResult?.AccessToken;
            authSession.idToken = initiatedAuth?.AuthenticationResult?.IdToken;
            authSession.refreshToken = initiatedAuth?.AuthenticationResult?.RefreshToken;

            return { ...authSession, ...initiatedAuth?.AccessTokenPayload };
          }

        } catch (error) {

        }
      },
    }),
  ],
  callbacks: {
    async authorized({ auth }) {
      return !!auth;
    },
    jwt({ token, user }) {
      return { ...token, ...user };
    },
    session({ session, token }) {

      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.idToken = token.idToken as string;

      return session;
    }
  },
  cookies: {
    sessionToken: {
      name: `pt_app.session-token`,
      options: {
        httpOnly: true,
      }
    },
    callbackUrl: {
      name: `pt_app.callback-url`,
      options: {
        httpOnly: true,
      }
    },
    csrfToken: {
      name: `pt_app.csrf-token`,
      options: {
        httpOnly: true,
      }
    },
  },
});
