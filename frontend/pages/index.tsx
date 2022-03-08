import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Button from '../components/Button';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useSession, signIn, signOut } from 'next-auth/react';
import { navs, loggedInNavs } from '../constants/header';

const Home: NextPage = () => {
  const { data, status } = useSession();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {status === 'authenticated' ? <Header navs={loggedInNavs} /> : <Header navs={navs} />}
      <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="m-5 text-6xl font-bold">
          Welcome to <span className="text-blue-600">TripPlanr!</span>
        </h1>
        <h2 className="m-5 text-4xl">The All-In-One Smart Trip Planning Platform</h2>
        {status === 'authenticated' ? (
          <p className="m-5 text-2xl">Thanks for logging in! View your trips or create a new one below.</p>
        ) : (
          <p className="m-5 text-2xl">Get started by signing up or logging in below.</p>
        )}
        <div className="flex-row">
          {status === 'authenticated' ? (
            <>
              <Link href="/trips">
                <Button buttonText="My Trips"></Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/signup">
                <Button buttonText="Sign Up"></Button>
              </Link>
            </>
          )}

          {status === 'authenticated' ? (
            <>
              <Link href="/onboard">
                <Button buttonText="New Trip"></Button>
              </Link>
            </>
          ) : (
            <Button buttonText="Log In" onClick={() => signIn(undefined, { callbackUrl: '/trips' })} />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
