import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { loginSchema } from '@/lib/validations';
import { initDatabase } from '@/lib/init-db';

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
          console.log('Auth attempt with credentials:', credentials);
          
          // Ensure database is initialized
          await initDatabase();
          
          if (!credentials?.email) {
            console.error('No email provided');
            return null;
          }

          const { email } = loginSchema.parse(credentials);
          console.log('Parsed email:', email);
          
          // Find user in database
          let user;
          try {
            const result = await db
              .select()
              .from(users)
              .where(eq(users.email, email))
              .limit(1);
            
            user = result[0];
            console.log('Found existing user:', !!user);
          } catch (dbError) {
            console.error('Database query error:', dbError);
            return null;
          }

          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              isAdmin: user.isAdmin,
            };
          }

          // For demo purposes, create new users on the fly
          console.log('Creating new user for email:', email);
          try {
            const [newUser] = await db
              .insert(users)
              .values({
                email,
                name: email.split('@')[0], // Use part before @ as name
                isAdmin: false,
              })
              .returning();

            console.log('Created new user:', newUser.id);
            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              isAdmin: newUser.isAdmin,
            };
          } catch (insertError) {
            console.error('User creation error:', insertError);
            return null;
          }
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
  // Trust host in production
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
});