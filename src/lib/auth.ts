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
          console.log('=== AUTH ATTEMPT START ===');
          console.log('Credentials received:', { email: credentials?.email, hasCredentials: !!credentials });
          
          if (!credentials?.email) {
            console.error('❌ No email provided in credentials');
            return null;
          }

          let email: string;
          try {
            const parsed = loginSchema.parse(credentials);
            email = parsed.email;
            console.log('✅ Email validation passed:', email);
          } catch (validationError) {
            console.error('❌ Email validation failed:', validationError);
            return null;
          }
          
          // Ensure database is initialized
          console.log('🔄 Initializing database...');
          const initResult = await initDatabase();
          if (!initResult) {
            console.error('❌ Database initialization failed');
            return null;
          }
          console.log('✅ Database initialized successfully');
          
          // Find existing user
          let user;
          try {
            console.log('🔍 Searching for existing user...');
            const result = await db
              .select()
              .from(users)
              .where(eq(users.email, email))
              .limit(1);
            
            user = result[0];
            console.log('🔍 User search result:', { found: !!user, email });
          } catch (dbError) {
            console.error('❌ Database query failed:', dbError);
            return null;
          }

          if (user) {
            console.log('✅ Returning existing user:', user.id);
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              isAdmin: user.isAdmin,
            };
          }

          // Create new user
          console.log('👤 Creating new user for email:', email);
          try {
            const [newUser] = await db
              .insert(users)
              .values({
                email,
                name: email.split('@')[0], // Use part before @ as name
                isAdmin: false,
              })
              .returning();

            console.log('✅ New user created successfully:', { id: newUser.id, email: newUser.email });
            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              isAdmin: newUser.isAdmin,
            };
          } catch (insertError) {
            console.error('❌ User creation failed:', insertError);
            return null;
          }
        } catch (error) {
          console.error('❌ Authentication error:', error);
          return null;
        } finally {
          console.log('=== AUTH ATTEMPT END ===');
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