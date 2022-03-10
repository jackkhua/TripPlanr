import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { picture_mapping } from '../constants/images';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Button from '../components/Button';
import Trip from '../components/Trip';
import Header from '../components/Header';
import { TripObj } from '../constants/types';
import Footer from '../components/Footer';

const Trips: NextPage = () => {
  const { data, status } = useSession();
  const [trips, setTrips] = useState<Array<TripObj> | []>([]);
  const [tripElements, setTripElements] = useState([]);
  const router = useRouter();
  const navs = [{ name: 'Sign Out', path: '/api/auth/signout' }];

  const getTrips = async () => {
    console.log('Getting Trips');
    // SHOULD GET AN ARRAY OF TRIP OBJECTS
    const trips_url = `${process.env.SERVER_URL || 'http://localhost:8080'}/users/${data.user_id}/trips`;

    const req = await fetch(trips_url);

    const trips_data = await req.json();
    const trip_ids = Object.keys(trips_data);
    let trips: Array<TripObj> = [];
    for (const id of trip_ids) {
      const trip = trips_data[id];
      const sorted_dates = Object.keys(trip.schedule).sort();
      const start_date = sorted_dates[0];
      const end_date = sorted_dates[sorted_dates.length - 2];
      const locations_url = `${process.env.SERVER_URL || 'http://localhost:8080'}/location/${trip.location_code}`;
      const location_req = await fetch(locations_url);
      const location_resp = await location_req.json();
      trips.push({
        trip_id: id,
        location_code: trip.location_code,
        schedule: trip.schedule,
        user_id: trip.user_id,
        meta_data: trip.meta_data,
        start_date: start_date,
        end_date: end_date,
        location: location_resp.city,
        image: picture_mapping[location_resp.city],
      });
    }

    setTrips(trips);

    const trip_elements = trips.map((trip) => (
      <>
        <a href={`/trips/${trip.trip_id}`}>
          <Trip startDate={trip.start_date} endDate={trip.end_date} travelLocation={trip.location} image={trip.image} />
        </a>
      </>
    ));
    setTripElements(trip_elements);
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
          <Link href={'/onboard'}>
            <Button buttonText="Add Trip" />
          </Link>
          <div className="flex grow flex-row">{tripElements}</div>
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
