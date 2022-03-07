import React, { InputHTMLAttributes } from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

type InputProps = {
  errorState: boolean;
  formFieldName: string;
  formRegisterOptions?: RegisterOptions;
  small?: boolean;
};

const Input: React.FC<InputProps & InputHTMLAttributes<HTMLInputElement>> = ({
  errorState,
  formFieldName,
  formRegisterOptions,
  small,
  ...props
}) => {
  const { register } = useFormContext();
  return (
    <input
      className={`w-full appearance-none rounded-md border-2 p-2 ${
        errorState ? 'border-red-500' : 'border-gray-200 focus:border-cyan-400'
      } placeholder-gray-500 focus:outline-none ${small ? 'text-sm' : ''}`}
      {...register(formFieldName, formRegisterOptions)}
      {...props}
    />
  );
};

export default Input;
