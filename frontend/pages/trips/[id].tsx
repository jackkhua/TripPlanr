import { NextPage } from 'next';
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Attraction from '../../components/Attraction';
import Button from '../../components/Button';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { loggedInNavs } from '../../constants/header';

const TripPage: NextPage = () => {
  const { data, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const [tripData, setTripData] = useState({});
  const [locationCode, setLocationCode] = useState('');
  const [location, setLocation] = useState('');

  const [travelOption, setTravelOption] = useState({});
  const [budget, setBudget] = useState({});
  const [eventOptions, setEventOptions] = useState({});
  const [attractionOptions, setAttractionOptions] = useState({});
  const [activityOptions, setActivityOptions] = useState({});
  const [socialOption, setSocialOption] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [schedule, setSchedule] = useState({});

  const getTripData = async () => {
    console.log('Getting trip data');
    const trips_url = `${process.env.SERVER_URL || 'http://localhost:8080'}/users/${data.user_id || data?.user.user_id}/trip/${id}`;
    const trip_req = await fetch(trips_url);
    const trip_data = await trip_req.json();
    console.log(JSON.stringify(trip_data));
    setTripData(trip_data);
    await getTripLocation(trip_data);
    getTravelOption(trip_data);
    getBudget(trip_data);
    getEventOptions(trip_data);
    getAttractionOptions(trip_data);
    getActivityOptions(trip_data);
    getTripDates(trip_data);
    getSocialOption(trip_data);
    setSchedule(trip_data.schedule);
    console.log(schedule);
  };

  const getTripLocation = async (trip) => {
    const locations_url = `${process.env.SERVER_URL || 'http://localhost:8080'}/location/${trip.location_code}`;
    const location_req = await fetch(locations_url);
    const location_resp = await location_req.json();
    setLocation(location_resp.city);
  };

  const getTravelOption = (trip) => {
    const meta_data = trip.meta_data;
    if ('group' in meta_data) {
      setTravelOption({ text: 'as a group', tag: 'group' });
    } else if ('family' in meta_data) {
      setTravelOption({ text: 'as a family', tag: 'family' });
    } else if ('individual' in meta_data) {
      setTravelOption({ text: 'by myself', tag: 'individual' });
    } else {
      setTravelOption({ text: '', tag: '' });
    }
  };

  const getBudget = (trip) => {
    const meta_data = trip.meta_data;
    if ('expensive' in meta_data) {
      setBudget({ text: 'a lot', tag: 'expensive' });
    } else if ('cheap' in meta_data) {
      setBudget({ text: 'a low amount', tag: 'cheap' });
    } else if ('moderate' in meta_data) {
      setBudget({ text: 'a moderate amount', tag: 'moderate' });
    }
  };

  const getEventOptions = (trip) => {
    const meta_data = trip.meta_data;
    if ('active' in meta_data) {
      setEventOptions({ text: 'active', tag: 'active' });
    } else if ('relaxing' in meta_data) {
      setEventOptions({ text: 'relaxing', tag: 'relaxing' });
    } else if ('active_relaxing' in meta_data) {
      setEventOptions({ text: 'active and relaxing', tag: 'active_relaxing' });
    }
  };

  const getAttractionOptions = (trip) => {
    const meta_data = trip.meta_data;
    if ('indoor' in meta_data) {
      setAttractionOptions({ text: 'indoor', tag: 'indoor' });
    } else if ('outdoor' in meta_data) {
      setAttractionOptions({ text: 'outdoor', tag: 'outdoor' });
    } else if ('indoor_outdoor' in meta_data) {
      setAttractionOptions({ text: 'indoor and outdoor', tag: 'indoor_outdoor' });
    }
  };

  const getActivityOptions = (trip) => {
    const meta_data = trip.meta_data;
    const activities = new Set([
      'Nature',
      'Sightseeing',
      'Theaters',
      'Museum & Gallery',
      'Sports & Activities',
      'Shopping',
      'Alcohol',
      'Casinos',
      'Zoos',
      'Aquariums',
      'Amusement & Theme Parks',
      'Cultural Events',
      'Food & Drink',
    ]);
    const trip_activities = Object.keys(meta_data).filter((val) => activities.has(val));
    const activities_string = trip_activities.join(', ');
    console.log('activities', activities_string);
    setActivityOptions({ text: activities_string, tag: trip_activities });
  };

  const getTripDates = (trip) => {
    const schedule = Object.keys(trip.schedule).sort();
    const start_date = schedule[0];
    const end_date = schedule[schedule.length - 2];
    setStartDate(start_date);
    setEndDate(end_date);
  };

  const getSocialOption = (trip) => {
    const meta_data = trip.meta_data;
    if ('social' in meta_data) {
      setSocialOption({ text: 'Interested', tag: 'social' });
    } else if ('non_social' in meta_data) {
      setSocialOption({ text: 'Not interested', tag: 'non_social' });
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      getTripData();
    }
  }, [status]);

  const onEdit = () => {
    router.push({
      pathname: '/onboard',
      query: {
        update_id: id,
        location: location,
        start_date: startDate,
        end_date: endDate,
        travel_option: travelOption.tag,
        attraction_option: attractionOptions.tag,
        event_option: eventOptions.tag,
        budget: budget.tag,
        local: socialOption.tag,
        attractions: activityOptions.tag,
      },
    });
  };

  const onDelete = async () => {
    const delete_url = `${process.env.SERVER_URL || "http://localhost:8080"}/users/${data.user_id || data?.user.user_id}/trip/${id}`;
    const req = await fetch(delete_url, {
      method: "DELETE"
    });
    if (req.ok) {
      alert('Trip was successfully deleted!');
    } else {
      alert('There was an error while deleting your trip.');
    }
    router.push("/trips");
  };

  const itineraryItems = schedule
    ? Object.keys(schedule).map((day) => (
        <div className='w-10/12 max-w-[800px]'>
          <h1 className="text-2xl">{day}</h1>
          <div className='border-b mb-5 mt-2 border-black '/>
          {schedule.[day].map((attraction, i) => (
            <Attraction
              name={attraction.attraction_name}
              img_url={attraction.img}
              rating={attraction.rating}
              labels={Object.keys(attraction.labels)}
              tags={attraction.tags}
              url={attraction.source_url}
              key={i}
            />)
            )}
        </div>
    ))
    : [];
  if (status === 'authenticated') {
    return (
      <div className="min-w-full grid place-items-center">
        <Header navs={loggedInNavs} />
        <div className="m-12 flex flex-col">
          <h1 className="text-3xl">Your Trip Details</h1>
          <p className="my-2 text-xl">Trip to {location}</p>
          <p className="my-2 text-xl">
            From {startDate} to {endDate}
          </p>
          <p className="my-2 text-xl">Travelling {travelOption.text}</p>
          <p className="my-2 text-xl">Expected budget is {budget.text}</p>
          <p className="my-2 text-xl">Interested in {attractionOptions.text} attractions</p>
          <p className="my-2 text-xl">Interested in {eventOptions.text} events</p>
          <p className="my-2 text-xl">{socialOption.text} in engaging with locals and other tourists</p>
          <p className="my-2 text-xl">Activity preferences: {activityOptions.text}</p>
          <div>
            <Button buttonText="Edit Preferences" onClick={() => onEdit()} />
            <Button buttonText="Delete Trip" onClick={() => onDelete()} />
          </div>
          <h1 className="my-2 text-3xl">Your Itinerary</h1>
          {itineraryItems}
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <h1>Not Signed In</h1>
      <Link href="api/auth/signin">
        <Button buttonText="Sign In" onClick={() => signIn()} />
      </Link>
    </div>
  );
};

export default TripPage;
