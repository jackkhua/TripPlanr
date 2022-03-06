import React from 'react';
import { NextPage } from 'next';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import Input from '../components/Input';
import { validateEmail } from '../utils/signup';
import Button from '../components/Button';
import Footer from '../components/Footer';

type SignupFormValues = {
  email: string;
  password: string;
};

const Signup: NextPage = () => {
  const formMethods = useForm<SignupFormValues>();
  const formErrors = formMethods.formState.errors;
  const router = useRouter();

  const onSubmit: SubmitHandler<SignupFormValues> = (values) => {
    const email = values.email;
    const password = values.password;

    // TODO: MAKE API CALL
    console.log(`Sending email = ${email} and password = ${password}`);
  };

  return (
    <SignupWrapper>
      <SignupTitle>Register</SignupTitle>
      <FormProvider {...formMethods}>
        <form className="lg:w-3/7 md:`w-1/2 mt-12 w-3/4 xl:w-1/3" onSubmit={formMethods.handleSubmit(onSubmit)}>
          <div className="flex flex-row space-x-5">
            <p>Email</p>
            <Input
              type="email"
              formFieldName="email"
              placeholder="email@example.com"
              autoComplete="off"
              errorState={Boolean(formErrors.email)}
              formRegisterOptions={{
                required: {
                  value: true,
                  message: 'Please enter an e-mail address.',
                },
                validate: (value) => validateEmail(value) || 'Please enter a valid e-mail address.',
              }}
              {...formMethods.register('email')}
            />
            <p>Password</p>
            <Input
              type="password"
              formFieldName="password"
              autoComplete="off"
              errorState={Boolean(formErrors.password)}
              formRegisterOptions={{
                required: {
                  value: true,
                  message: 'Please enter a password.',
                },
              }}
            />
            <Button buttonText="Submit" />
          </div>
        </form>
      </FormProvider>
      <br />
      <br />
      <Footer />
    </SignupWrapper>
  );
};

export default Signup;

/* Styles */

const SignupWrapper = styled.div`
  margin: 20px;
`;

const SignupTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
`;
