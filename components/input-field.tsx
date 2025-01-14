import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  placeholder?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type,
  register,
  error,
  placeholder,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </div>
  );
};
