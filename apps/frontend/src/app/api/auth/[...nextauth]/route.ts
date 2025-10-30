import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';
import api from '@/lib/axios';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await api.post('/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });

          const { token, user } = response.data;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken: token,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        const userWithToken = user as typeof user & { accessToken?: string };
        return {
          ...token,
          id: user.id,
          name: user.name,
          email: user.email,
          accessToken: userWithToken.accessToken || account.access_token,
        };
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        if (token.accessToken) {
          Object.assign(session, { accessToken: token.accessToken });
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Use NEXTAUTH_URL if available, otherwise fallback to baseUrl
      const authUrl = process.env.NEXTAUTH_URL || baseUrl;
      
      // Always redirect to dashboard after successful Google OAuth
      if (url.includes('/api/auth/callback/google')) {
        return `${authUrl}/dashboard`;
      }
      // Handle other relative URLs
      if (url.startsWith("/")) return `${authUrl}${url}`;
      return url;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
