import NextAuth from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  theme: {
    colorScheme: 'light',
    brandColor: '#2590EB',
  },
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: {
          label: 'E-mail',
          type: 'text',
          placeholder: 'example@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        console.log('Attempting to authenticate with credentials', JSON.stringify(credentials));
        // const res = await fetch('/authenticate', {
        //   method: 'GET',
        //   body: JSON.stringify(credentials),
        //   headers: { 'Content-Type': 'application/json' },
        // });

        // const user = await res.json();

        // if (res.ok && user) {
        //   return user;
        // }

        // return null;
        const user = {
          user_id: 1,
          user_name: 'John Smith',
          email: 'example@example.com',
        };
        return user;
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.user = token.user;
      console.log('SESSION', JSON.stringify(session));

      return session;
    },
  },
});
