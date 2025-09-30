// components/CustomInput.tsx
import React, { forwardRef, useState, useEffect } from 'react';
import clsx from 'clsx';

// type InputType = 
//   | 'text'
//   | 'number'
//   | 'email'
//   | 'password'
//   | 'date'
//   | 'time'
//   | 'datetime-local'
//   | 'tel'
//   | 'url'
//   | 'search';

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onValueChange?: (value: string) => void;
  borderColor?: string;

}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      type = 'text',
      label,
      error,
      helpText,
      className,
      containerClassName,
      borderColor = "#A9A9A9",
      leftIcon,
      rightIcon,
      onChange,
      onValueChange,
      ...props
    },
    ref
  ) => {
    // const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState(props.value || props.defaultValue || '');

    useEffect(() => {
      if (props.value !== undefined) {
        setInputValue(props.value);
      }
    }, [props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      onChange?.(e);
      onValueChange?.(e.target.value);
    };

    const inputClasses = clsx(
      'block w-full rounded-[4px] placeholder:text-[14px] shadow-sm focus:outline-none sm:text-sm',
      'disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500',
      {
        'border-gray-300 focus:border-primary-500 focus:ring-primary-500': !error && !borderColor,
        'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500': error,
        'pl-10': leftIcon,
        'pr-10': rightIcon,
      },
      borderColor ? `border border-[${borderColor}]` : 'border border-[#A9A9A9]',
      type === 'number' ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' : '',
      className
    );


    const containerClasses = clsx('w-full', containerClassName);

    return (
      <div className={containerClasses}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-BlackHomz mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            className={inputClasses}
            // onFocus={() => setIsFocused(true)}
            // onBlur={() => setIsFocused(false)}
            style={borderColor && !error ? { borderColor } : undefined}
            onChange={handleChange}
            value={inputValue}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </div>
          )}
        </div>

        {helpText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helpText}</p>
        )}

        {error && (
          <p className="mt-1 text-sm text-red-600" id={`${props.id}-error`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';

export default CustomInput;