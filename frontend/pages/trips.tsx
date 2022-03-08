import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Button from '../components/Button';
import Trip from '../components/Trip';
import Header from '../components/Header';
import { TripObj } from '../constants/types';
import Footer from '../components/Footer';

const tempTrips: TripObj[] = [{ id: '1', schedule: {}, user_id: '123', meta_data: {} }];

const Trips: NextPage = () => {
  const { data, status } = useSession();
  const [gotTrips, setGotTrips] = useState(false);
  const [trips, SetTrips] = useState<Array<TripObj> | []>([]);
  const router = useRouter();
  const navs = [{ name: 'Sign Out', path: '/api/auth/signout' }];

  const getTrips = async () => {
    console.log('Getting Trips');
    console.log('user id', data.user_id);
    // SHOULD GET AN ARRAY OF TRIP OBJECTS
    const trips_url = `${process.env.SERVER_URL || 'http://localhost:8080'}/users/${data.user_id}/trips`;
    const req = await fetch(trips_url);
    const trips_data = req.json();
    console.log(JSON.stringify(trips_data));
    let trips: Array<TripObj> = [];
  };

  useEffect(() => {
    if (status === 'authenticated') {
      getTrips();
    }
  }, [status]);
  if (status === 'authenticated') {
    return (
      <div className="min-w-full items-center">
        <Header navs={navs} />
        <div className="m-8 flex-row items-center">
          <h1 className="text-3xl font-bold">Your Trips</h1>
          <div className="flex grow flex-row">
            <a href="/trips/12">
              <Trip startDate="2021-12-17" endDate="2021-12-23" travelLocation="New York" activities={[]} />
            </a>
            <Trip startDate="2021-12-17" endDate="2021-12-23" travelLocation="Singapore" activities={[]} />
            <Trip startDate="2021-12-17" endDate="2021-12-23" travelLocation="Seoul" activities={[]} />
            <Trip startDate="2021-12-17" endDate="2021-12-23" travelLocation="Tokyo" activities={[]} />
            <Trip startDate="2021-12-17" endDate="2021-12-23" travelLocation="London" activities={[]} />
          </div>
        </div>
        <Footer />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Not Signed In</h1>
        <Link href="api/auth/signin">
          <Button buttonText="Sign In" onClick={() => signIn()} />
        </Link>
      </div>
    );
  }
};

export default Trips;
