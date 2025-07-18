import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-');
    
    return (
      <fieldset className="relative">
        <legend className="text-[13px] font-medium text-black mb-2">
          {label}
        </legend>
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full h-[30px] px-4 rounded-[25px] border border-black border-solid bg-white text-[13px] font-medium text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <div
            id={`${inputId}-error`}
            className="absolute top-full left-0 mt-1 text-xs text-red-600"
            role="alert"
          >
            {error}
          </div>
        )}
      </fieldset>
    );
  }
);

InputField.displayName = 'InputField';

export { InputField };
