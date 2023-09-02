import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AuthService from "@/service/auth.service";
import NextAuth, { NextAuthOptions } from "next-auth";
import { ILogIn } from "@/types/auth/request";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials): Promise<any> {
        try {
          const { email, password } = credentials as ILogIn;

          const res = await AuthService.login({
            email,
            password,
          });

          if (res.status !== 200) {
            return Promise.reject(
              new Error("Api Response Error Http Status: " + res.status),
            );
          }

          const { data } = res;
          const { user, tokens } = data;

          return {
            ...user,
            ...tokens,
          };
        } catch (error: any) {
          return Promise.reject(
            new Error(JSON.stringify(error.response?.data)),
          );
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      /* Configurar informações do usuário disponiveis no JSON do provider aqui! */
      console.log("signIn - user", user);
      console.log("signIn - account", account);
      console.log("signIn - profile", profile);

      /*       if (account?.provider !== "credentials") {
        const authSocialRes = await AuthService.loginSocial({
          provider: account?.provider,
          providerAccountId: account?.providerAccountId,
          accessToken: account?.["access_token"],
        });

        if (authSocialRes.status !== 200) {
          return Promise.reject(
            new Error(
              "Api Response Error Http Status: " + authSocialRes.status,
            ),
          );
        }

        const { data } = authSocialRes;
        const { user } = data;

        if (!user) {
          return Promise.reject(new Error("No user found"));
        }

        return true;
      } */

      return true;
    },

    async session({ session, token, user }) {
      /* Configurar informações da sessão disponiveis no JSON do provider aqui! */

      console.log("session", session);
      console.log("token", token);
      console.log("user", user);

      session = {
        ...token,
        expires: session.expires,
      };

      return Promise.resolve(session);
    },

    async jwt({ token, user, account, profile }) {
      /* Configurar informações do token disponiveis no JSON do provider aqui! */
      console.log("JWT - token", token);
      console.log("JWT - user", user);
      console.log("JWT - account", account);
      console.log("JWT - profile", profile);

      token = {
        ...token,
        ...user,
      };

      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };