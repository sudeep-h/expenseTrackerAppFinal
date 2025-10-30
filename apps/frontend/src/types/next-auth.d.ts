import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    accessToken?: string;
  }
}
