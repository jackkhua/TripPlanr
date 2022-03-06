import { NextPage } from 'next';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Button from '../components/Button';
import Trip from '../components/Trip';

const Trips: NextPage = () => {
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const user = data?.user?.email;
  }, []);
  if (status === 'authenticated') {
    return (
      <TripsWrapper>
        <Title>Trips</Title>
        <p>{JSON.stringify(data)}</p>
        <Trip startDate="2021-12-17" endDate="2021-12-23" travelLocation="Bahamas" activities={[]} />
      </TripsWrapper>
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

/* Styles */

const TripsWrapper = styled.div`
  margin: 20px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
`;
