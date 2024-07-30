import React from "react";

export function TextInputElement({
  name,
  value,
  placeholder,
  handleChange,
  disabled,
  children,
}: {
  name: string;
  value: string;
  placeholder: string;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      {children}
      <input
        id={name}
        name={name}
        type="text"
        autoComplete={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="block w-full rounded-md border-0 px-2 py-1.5 font-normal text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
    </label>
  );
}
