import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Button from '../components/Button';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { NavLink } from '../constants/types';

const navs: NavLink[] = [
  { name: 'Sign Up', path: '/signup' },
  { name: 'Login', path: '/login' },
];
const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Header navs={navs} /> */}
      <div className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="m-5 text-6xl font-bold">
          Welcome to <span className="text-blue-600">TripPlanr!</span>
        </h1>
        <h2 className="m-5 text-4xl">The All-In-One Smart Trip Planning Platform</h2>

        <p className="m-5 text-2xl">Get started by signing up or logging in below.</p>
        <div className="flex-row space-x-4">
          <Link href="/signup">
            <Button buttonText="Sign Up"></Button>
          </Link>
          <Link href="/api/auth/signin">
            <Button buttonText="Log In"></Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
