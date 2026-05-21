import type { NextAuthOptions } from "next-auth";
import type { Role } from "@prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmailForCredentials } from "@/lib/db/prisma-credentials";

import { resolveAuthSecret } from "@/lib/auth/secret";

const authSecret = resolveAuthSecret();

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7,
  },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email = credentials?.email?.trim().toLowerCase();
          const password = credentials?.password;
          if (!email || !password) return null;

          const user = await findUserByEmailForCredentials(email);
          if (!user?.passwordHash) return null;

          const valid = await bcrypt.compare(password, user.passwordHash);
          if (!valid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
            role: user.role,
          };
        } catch (error) {
          console.error("[AUTH_AUTHORIZE_ERROR]", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role ?? "ADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as Role | undefined) ?? "ADMIN";
      }
      return session;
    },
  },
  secret: authSecret,
};
