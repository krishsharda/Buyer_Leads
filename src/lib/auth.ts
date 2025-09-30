import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { loginSchema } from '@/lib/validations';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    isAdmin: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        try {
          const { email } = loginSchema.parse(credentials);
          
          // Find user in database
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              isAdmin: user.isAdmin,
            };
          }

          // For demo purposes, create new users on the fly
          // In production, you'd want proper registration flow
          const [newUser] = await db
            .insert(users)
            .values({
              email,
              name: email.split('@')[0], // Use part before @ as name
              isAdmin: false,
            })
            .returning();

          return {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            isAdmin: newUser.isAdmin,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET || 'development-secret-key',
  session: {
    strategy: 'jwt',
  },
  // Auto-detect production URL for Railway
  ...(process.env.NODE_ENV === 'production' && process.env.RAILWAY_PUBLIC_DOMAIN && {
    trustHost: true,
  }),
  debug: process.env.NODE_ENV === 'development',
});