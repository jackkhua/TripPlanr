import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { loggedInNavs } from '../../constants/header';

const TripPage: NextPage = () => {
  const router = useRouter();
  const [editable, setEditable] = useState(false);
  const { id } = router.query;

  const onClick = () => {
    setEditable(!editable);
  };
  return (
    <div className="min-w-full items-center">
      <Header navs={loggedInNavs} />
      <div className="m-12 flex flex-col	bg-slate-100">
        <h1 className="text-3xl">Your Trip Details</h1>
        {editable ? <label>Trip to</label> : <p>Trip to New York</p>}
        <p>Travelling as a group</p>
        <div className="m-auto w-1/6">
          <Button buttonText={editable ? 'Save' : 'Edit Trip'} onClick={() => onClick()} />
        </div>
        <h1 className="text-3xl">Your Itinerary</h1>
      </div>
      <Footer />
    </div>
  );
};

export default TripPage;
