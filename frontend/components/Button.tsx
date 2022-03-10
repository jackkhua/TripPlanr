import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps = {
  buttonText: string;
  small?: boolean;
};

const Button: React.FC<ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>> = React.forwardRef(
  ({ buttonText, small, onClick, ...props }, ref) => {
    return (
      <button
        className={`m-2 rounded-md border-2 border-transparent py-2 px-4 ${
          small ? 'text-sm' : 'text-md'
        } bg-black text-white hover:border-black hover:bg-white hover:text-black`}
        {...props}
        onClick={onClick}
      >
        {buttonText}
      </button>
    );
  }
);

export default Button;
