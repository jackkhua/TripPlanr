import React from 'react';
import { NextPage } from 'next';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import Input from '../components/Input';
import { validateEmail } from '../utils/signup';
import Button from '../components/Button';
import Footer from '../components/Footer';
import { NavLink } from '../constants/types';
import Header from '../components/Header';

const navs: NavLink[] = [
  { name: 'Sign Up', path: '/signup' },
  { name: 'Login', path: '/api/auth/signin' },
];

type SignupFormValues = {
  email: string;
  password: string;
};

const Signup: NextPage = () => {
  const formMethods = useForm<SignupFormValues>();
  const formErrors = formMethods.formState.errors;
  const router = useRouter();

  const onSubmit: SubmitHandler<SignupFormValues> = async (values) => {
    const body = {
      user_name: values.email,
      password: values.password,
    };
    const url = process.env.SERVER_URL || 'http://localhost:8080/users';
    const req = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (req.status === 500) {
      alert(`Account with email ${values.email} already exists`);
    } else if (req.status === 200) {
      alert(`Account created!`);
      router.push('/api/auth/signin');
    }
  };

  return (
    <SignupWrapper>
      <Header navs={navs} />
      <div className="m-4 flex-col">
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
      </div>

      <br />
      <br />
      <Footer />
    </SignupWrapper>
  );
};

export default Signup;

/* Styles */

const SignupWrapper = styled.div`
  min-width: 100%;
`;

const SignupTitle = styled.h1`
  font-size: 20px;
  font-weight: 600;
`;
