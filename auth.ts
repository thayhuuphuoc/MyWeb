import NextAuth from "next-auth"
import { UserRole } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

import prisma from "@/lib/prisma";
import authConfig from "@/auth.config";
import {getUserById} from "@/actions/auth/prisma_data/user";
import { getTwoFactorConfirmationByUserId } from "@/actions/auth/prisma_data/two-factor-confirmation";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            emailVerified: new Date(),
            updatedAt: new Date(),
          }
        })
      } catch (error) {
        // Log error but don't throw to prevent OAuth flow failure
        if (process.env.NODE_ENV === 'development') {
          console.error('[LinkAccount] Error updating user:', error);
        }
      }
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);

      // Prevent sign in without email verification
      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) return false;

        // Delete two factor confirmation for next sign in
        await prisma.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id }
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (!session.user) return session;

      // Assign ID
      if (token.sub) {
        session.user.id = token.sub;
      }

      // Assign role
      if (token.role) {
        session.user.role = token.role as UserRole;
      }

      // Assign name with fallback
      session.user.name = token.name || session.user.name || null;

      // Assign email if provided
      if (token.email != null) {
        session.user.email = token.email;
      }

      // Assign image if provided (with type check)
      if (token.image != null && typeof token.image === 'string') {
        session.user.image = token.image;
      }

      // Assign emailVerified if provided (with type check)
      if (token.emailVerified != null && token.emailVerified instanceof Date) {
        session.user.emailVerified = token.emailVerified;
      }

      // Assign boolean flags with safe conversion
      session.user.isTwoFactorEnabled = Boolean(token.isTwoFactorEnabled);
      session.user.isPasswordSet = Boolean(token.isPasswordSet);

      return session;
    },
    async jwt({ token, user, trigger, session }) {
      // Handle update trigger with explicit assignment
      if (trigger === "update" && session.user) {
        if (session.user.id) token.sub = session.user.id;
        if (session.user.name) token.name = session.user.name;
        if (session.user.email) token.email = session.user.email;
        if (session.user.image) token.image = session.user.image;
        if (session.user.role) token.role = session.user.role;
        if (session.user.emailVerified) token.emailVerified = session.user.emailVerified;
        token.isTwoFactorEnabled = session.user.isTwoFactorEnabled;
        token.isPasswordSet = session.user.isPasswordSet;
      }

      if (!token.sub) return token;

      try {
        const existingUser = await getUserById(token.sub);

        if (!existingUser) return token;

        // Explicit assignment for type safety
        token.sub = existingUser.id;
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.image = existingUser.image;
        token.role = existingUser.role;
        token.emailVerified = existingUser.emailVerified;
        token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
        token.isPasswordSet = Boolean(existingUser.password);

        return token;
      } catch (error) {
        // Log error in development, return current token to prevent auth failure
        if (process.env.NODE_ENV === 'development') {
          console.error('[JWT Callback] Error fetching user:', error);
        }
        return token;
      }
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
