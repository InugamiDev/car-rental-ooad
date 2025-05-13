import NextAuth, { NextAuthOptions, User as DefaultNextAuthUser, Session as DefaultNextAuthSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { AdapterUser } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './prisma';
import bcrypt from 'bcryptjs';

export interface AppUser extends DefaultNextAuthUser {
  id: string;
}

export interface AppSession extends DefaultNextAuthSession {
  user?: AppUser;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: Record<string, string> | undefined): Promise<AppUser | null> {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const dbUser = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        if (dbUser && bcrypt.compareSync(credentials.password, dbUser.password)) {
          return { id: dbUser.id, name: dbUser.name, email: dbUser.email, image: null };
        }
        return null;
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: AppUser | AdapterUser }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }: { session: DefaultNextAuthSession; token: JWT }): Promise<AppSession> {
      const newSession: AppSession = {
        expires: session.expires,
        user: undefined,
      };
      if (token && typeof token.id === 'string') {
        newSession.user = {
          id: token.id,
          name: token.name as string | null | undefined,
          email: token.email as string | null | undefined,
          image: token.picture as string | null | undefined,
        };
      }
      return newSession;
    }
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);