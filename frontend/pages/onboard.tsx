import { NextPage } from 'next';
import React, { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Button from '../components/Button';
import { FormProvider, SubmitHandler, useForm, Controller } from 'react-hook-form';
import Input from '../components/Input';
import Select from 'react-select';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { navs, loggedInNavs } from '../constants/header';
import Header from '../components/Header';
import Footer from '../components/Footer';

const travel_locations = [
  { value: 'New York City', label: 'New York' },
  { value: 'Seoul', label: 'Seoul' },
  { value: 'London', label: 'London' },
  { value: 'Singapore', label: 'Singapore' },
];
const travel_options = [
  { value: 'family', label: 'As a Family' },
  { value: 'group', label: 'As a Group' },
  { value: 'individual', label: 'By Myself' },
];
const attraction_options = [
  { value: 'indoor', label: 'Indoors' },
  { value: 'outdoor', label: 'Outdoors' },
  { value: 'no_preference', label: 'No Preference' },
];

const event_options = [
  { value: 'active', label: 'Active' },
  { value: 'relaxing', label: 'Relaxing' },
  { value: 'no_preference', label: 'No Preference' },
];

const budget_options = [
  { value: 'expensive', label: 'A lot' },
  { value: 'moderate', label: 'A moderate amount' },
  { value: 'cheap', label: 'A low amount' },
];

const local_options = [
  { value: 'social', label: 'Yes' },
  { value: 'non_social', label: 'No' },
];

const activity_options = [
  { value: 'Nature', label: 'Nature' },
  { value: 'Sightseeing', label: 'Sightseeing' },
  { value: 'Museum & Gallery', label: 'Museums and Galleries' },
  { value: 'Theaters', label: 'Theatres' },
  { value: 'Sports & Activities', label: 'Sports and Physical Activities' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Alcohol', label: 'Bars and Alcohol' },
  { value: 'Casinos', label: 'Casinos and Gambling' },
  { value: 'Zoos', label: 'Zoos and Animal Parks' },
  { value: 'Aquariums', label: 'Aquariums and Sea Exhibits' },
  { value: 'Amusement & Theme Parks', label: 'Amusement and Theme Parks' },
  { value: 'Cultural Events', label: 'Cultural Events' },
];
type ActivityObj = {
  value: string;
  label: string;
};
type OnboardingValues = {
  travel_location: string;
  start_date: string;
  end_date: string;
  travel_option: string;
  attraction_option: string;
  event_option: string;
  budget_option: string;
  local_option: string;
  activity_options: ActivityObj[];
};

const Questions: NextPage = () => {
  const { data } = useSession();
  const router = useRouter();
  const { update_id } = router.query;
  const [startedFlow, setStartedFlow] = useState(false);

  const formMethods = useForm<OnboardingValues>();
  const formErrors = formMethods.formState.errors;

  const onSubmit: SubmitHandler<OnboardingValues> = async (values) => {
    const user_id = data.user_id;
    const location_url = `${process.env.SERVER_URL || 'http://localhost:8080'}/location/all`;
    console.log(location_url);
    const location_req = await fetch(location_url);
    const location_data = await location_req.json();

    const location_code = location_data[values.travel_location].location_code;
    const trip_labels = values.activity_options.map((item) => item.value);
    const meta_data = {
      [values.travel_option]: true,
      [values.attraction_option]: true,
      [values.event_option]: true,
      [values.budget_option]: true,
      [values.local_option]: true,
    };
    for (const label of trip_labels) {
      Object.assign(meta_data, { [label]: true });
    }
    const body = {
      meta_data: meta_data,
      location_code: location_code,
    };
    console.log('BODY', JSON.stringify(body));
    let trip_resp;
    if (update_id) {
      const update_trip_url = `${process.env.SERVER_URL || 'http://localhost:8080'}/users/${user_id}/trip/${trip_id}`;
      const trip_req = await fetch(update_trip_url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      trip_resp = await trip_req.json();
    } else {
      const trip_url = `${process.env.SERVER_URL || 'http://localhost:8080'}/users/${user_id}/trip`;
      const trip_req = await fetch(trip_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      trip_resp = await trip_req.json();
    }
    const trip_id = trip_resp.trip_id;
    const generate_itinerary_url = `${
      process.env.SERVER_URL || 'http://localhost:8080'
    }/users/${user_id}/location/${location_code}/generate_itinerary/${trip_id}`;
    const itinerary_body = {
      start_date: values.start_date,
      end_date: values.end_date,
    };
    console.log(generate_itinerary_url);
    console.log(JSON.stringify(itinerary_body));
    const generate_itinerary_req = await fetch(generate_itinerary_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itinerary_body),
    });

    const itinerary_data = await generate_itinerary_req.json();
    console.log(itinerary_data);
    const update_trip_body = {
      schedule: itinerary_data,
    };
    const update_trip_url = `${process.env.SERVER_URL || 'http://localhost:8080'}/users/${user_id}/trip/${trip_id}`;
    const trip_req = await fetch(update_trip_url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update_trip_body),
    });
    alert('Your trip has been created!');

    router.push('/trips');
  };

  if (data) {
    if (!startedFlow) {
      return (
        <>
          <div className="h-[85vh] w-screen flex-col">
            <Header navs={loggedInNavs} />
            <div className="m-auto grid h-1/2	w-1/2 place-items-center">
              <h1 className="align-center mt-10 text-center text-2xl">
                Thanks for choosing TripPlanr! Before we get started, we want to learn more about you so we can plan the
                perfect trip.
              </h1>
              <div className="mb-4 justify-self-center">
                <Button buttonText="Get Started" onClick={() => setStartedFlow(true)} />
              </div>
            </div>
          </div>
          <Footer />
        </>
      );
    } else {
      return (
        <div className="h-full w-full flex-col">
          <Header navs={loggedInNavs} />
          <div className="m-auto grid place-items-center">
            <FormProvider {...formMethods}>
              <form className="mt-12 w-1/2" onSubmit={formMethods.handleSubmit(onSubmit)}>
                <div className="flex flex-col space-x-5 space-y-5">
                  <label className="ml-5">Where are you travelling?</label>
                  <Controller
                    control={formMethods.control}
                    name="travel_location"
                    rules={{
                      required: {
                        value: true,
                        message: 'Travel location is required.',
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      <Select
                        inputRef={ref}
                        onBlur={onBlur}
                        options={travel_locations}
                        value={travel_locations.find((c) => c.value === value)}
                        onChange={(val) => onChange(val?.value)}
                      />
                    )}
                  />
                  <label>What date will you be starting your trip?</label>
                  <Input
                    type="date"
                    formFieldName="start_date"
                    autoComplete="off"
                    errorState={Boolean(formErrors.start_date)}
                    formRegisterOptions={{
                      required: {
                        value: true,
                        message: 'Please enter a start date.',
                      },
                    }}
                    {...formMethods.register('start_date')}
                  />
                  <label>What date will you be ending your trip?</label>
                  <Input
                    type="date"
                    formFieldName="end_date"
                    autoComplete="off"
                    errorState={Boolean(formErrors.end_date)}
                    formRegisterOptions={{
                      required: {
                        value: true,
                        message: 'Please enter an end date.',
                      },
                    }}
                    {...formMethods.register('end_date')}
                  />
                  <label>How will you be travelling this trip?</label>
                  <Controller
                    control={formMethods.control}
                    name="travel_option"
                    rules={{
                      required: {
                        value: true,
                        message: 'Travel type is required.',
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      <Select
                        inputRef={ref}
                        onBlur={onBlur}
                        options={travel_options}
                        value={travel_options.find((c) => c.value === value)}
                        onChange={(val) => onChange(val?.value)}
                      />
                    )}
                  />
                  <label>Do you enjoy indoor or outdoor activities?</label>
                  <Controller
                    control={formMethods.control}
                    name="attraction_option"
                    rules={{
                      required: {
                        value: true,
                        message: 'Activity type is required.',
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      <Select
                        inputRef={ref}
                        onBlur={onBlur}
                        options={attraction_options}
                        value={attraction_options.find((c) => c.value === value)}
                        onChange={(val) => onChange(val?.value)}
                      />
                    )}
                  />
                  <label>What kind of events are you looking for?</label>
                  <Controller
                    control={formMethods.control}
                    name="event_option"
                    rules={{
                      required: {
                        value: true,
                        message: 'Event type is required.',
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      <Select
                        inputRef={ref}
                        onBlur={onBlur}
                        options={event_options}
                        value={event_options.find((c) => c.value === value)}
                        onChange={(val) => onChange(val?.value)}
                      />
                    )}
                  />
                  <label>What's your budget for this trip?</label>
                  <Controller
                    control={formMethods.control}
                    name="budget_option"
                    rules={{
                      required: {
                        value: true,
                        message: 'Budget is required.',
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      <Select
                        inputRef={ref}
                        onBlur={onBlur}
                        options={budget_options}
                        value={budget_options.find((c) => c.value === value)}
                        onChange={(val) => onChange(val?.value)}
                      />
                    )}
                  />
                  <label>Are you interested in engaging with locals and other tourists in the area?</label>
                  <Controller
                    control={formMethods.control}
                    name="local_option"
                    rules={{
                      required: {
                        value: true,
                        message: 'Engagement option is required.',
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      <Select
                        inputRef={ref}
                        onBlur={onBlur}
                        options={local_options}
                        value={local_options.find((c) => c.value === value)}
                        onChange={(val) => onChange(val?.value)}
                      />
                    )}
                  />
                  <label>Select categories that you would be interested in.</label>
                  <Controller
                    control={formMethods.control}
                    name="activity_options"
                    rules={{
                      required: {
                        value: true,
                        message: 'At least one selection is required.',
                      },
                    }}
                    render={({
                      field: { onChange, onBlur, value, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      <Select
                        inputRef={ref}
                        onBlur={onBlur}
                        options={activity_options}
                        value={value}
                        onChange={onChange}
                        isMulti={true}
                      />
                    )}
                  />
                  <div className="grid place-items-center">
                    <Button buttonText="Submit" />
                  </div>
                </div>
              </form>
            </FormProvider>
          </div>
          <Footer />
        </div>
      );
    }
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

export default Questions;

/* Styles */
