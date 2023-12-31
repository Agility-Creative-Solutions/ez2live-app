import Button, { ButtonProps } from "@/components/atoms/Button/Button";
import React from "react";

export interface ButtonSecondaryProps extends ButtonProps {}

const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  className = "",
  ...args
}) => {
  return (
    <Button
      className={`font-semibold bg-secondary-main text-primary-main  hover:bg-secondary-dark ${className}`}
      {...args}
    />
  );
};

export default ButtonSecondary;
