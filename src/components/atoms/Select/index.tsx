import React, { FC, SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  className?: string;
  sizeClass?: string;
  field?: any;
}

const Select: FC<SelectProps> = ({
  className = "",
  sizeClass = "h-11",
  children,
  field,
  ...args
}) => {
  return (
    <select
      className={`nc-Select ${sizeClass} ${className} block w-full mb-9 p-3 text-sm font-semibold rounded-full border-black focus:border-primary-main focus:ring focus:ring-border-primary-main focus:ring-opacity-50 bg-generic-background`}
      {...args}
      {...field}
    >
      {children}
    </select>
  );
};

export default Select;
