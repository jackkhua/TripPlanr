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

const travel_locations = [
  { value: 'New York', label: 'New York' },
  { value: 'Tokyo', label: 'Tokyo' },
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
  { value: 'high', label: 'A lot' },
  { value: 'moderate', label: 'A moderate amount' },
  { value: 'low', label: 'A low amount' },
];

const local_options = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const activity_options = [
  { value: 'nature', label: 'Nature' },
  { value: 'sightseeing', label: 'Sightseeing' },
  { value: 'museums_galleries', label: 'Museums and Galleries' },
  { value: 'sports_activities', label: 'Sports and Physical Activities' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'alcohol', label: 'Bars and Alcohol' },
  { value: 'casinos', label: 'Casinos and Gambling' },
  { value: 'zoos', label: 'Zoos and Animal Parks' },
  { value: 'aquariums', label: 'Aquariums and Sea Exhibits' },
  { value: 'amusement_parks', label: 'Amusement and Theme Parks' },
  { value: 'cultural_events', label: 'Cultural Events' },
];

type OnboardingValues = {
  age: number;
  travel_location: string;
  start_date: string;
  end_date: string;
  travel_option: string;
  attraction_option: string;
  event_option: string;
  budget_option: string;
  local_option: string;
  activity_options: string[];
};

const Trips: NextPage = () => {
  const { data } = useSession();
  const router = useRouter();
  const [startedFlow, setStartedFlow] = useState(false);

  const formMethods = useForm<OnboardingValues>();
  const formErrors = formMethods.formState.errors;

  const onSubmit: SubmitHandler<OnboardingValues> = (values) => {
    console.log(`Received values: ${JSON.stringify(values)}`);
    alert('Your trip has been created!');

    router.push('/trips');
  };

  if (data) {
    if (!startedFlow) {
      return (
        <OnboardWrapper>
          <h1>
            Thanks for choosing TripPlanr! Before we get started, we want to learn more about you so we can plan the
            perfect trip.
          </h1>
          <Button buttonText="Get Started" onClick={() => setStartedFlow(true)} />
        </OnboardWrapper>
      );
    } else {
      return (
        <OnboardWrapper className="w-full flex-col">
          <FormProvider {...formMethods}>
            <form className="mt-12 w-1/2" onSubmit={formMethods.handleSubmit(onSubmit)}>
              <div className="flex flex-col space-x-5 space-y-5">
                <label>What is your age?</label>
                <Input
                  type="number"
                  formFieldName="age"
                  placeholder="25"
                  autoComplete="off"
                  errorState={Boolean(formErrors.age)}
                  formRegisterOptions={{
                    required: {
                      value: true,
                      message: 'Please enter your age.',
                    },
                  }}
                  {...formMethods.register('age')}
                />
                <label>Where are you travelling?</label>
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
                <Button buttonText="Submit" />
              </div>
            </form>
          </FormProvider>
        </OnboardWrapper>
      );
    }
  }

  return (
    <OnboardWrapper>
      <h1>Not Signed In</h1>
      <Link href="api/auth/signin">
        <Button buttonText="Sign In" onClick={() => signIn()} />
      </Link>
    </OnboardWrapper>
  );
};

export default Trips;

/* Styles */
const OnboardWrapper = styled.div`
  margin: 20px;
`;
