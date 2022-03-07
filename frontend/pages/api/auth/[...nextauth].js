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
        user_name: {
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
        const url = 'http://localhost:8080/authenticate';
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('STATUS: ', res.status);
        const user = await res.json();

        if (res.ok && user) {
          console.log(JSON.stringify(user));
          return user;
        }

        return null;
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
        const url = 'http://localhost:8080/users';
        const body = {
          user_name: token.email,
          password: account.access_token,
          meta_data: '',
        };
        const req = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (req.status === 500) {
          console.log(`Account with email ${token.email} already exists`);
        } else if (req.status === 200) {
          console.log(`Account with email ${token.email} created`);
        }
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

      return session;
    },
  },
});
