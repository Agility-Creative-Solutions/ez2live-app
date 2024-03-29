"use client";

import { Switch } from "@headlessui/react";
import React from "react";

export interface ToggleButtonProps {
  toggle: boolean;
  onClick: (e: any) => void;
  label?: string;
}
const ToggleButton: React.FC<ToggleButtonProps> = ({
  toggle,
  onClick,
  label,
}) => {
  return (
    <div className="inline-flex m-2">
      <Switch
        onClick={onClick}
        checked={toggle}
        className={`${toggle ? "bg-primary-main" : "bg-white"}
          relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full p-[4px] border-[2px] border-primary-main transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span
          aria-hidden="true"
          className={`${
            toggle ? "translate-x-6 bg-white" : "translate-x-0 bg-primary-main"
          }
          pointer-events-none inline-block h-3 w-3 transform rounded-full shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
      <span className=" flex items-center ml-2 text-xs font-semibold">
        {label}
      </span>
    </div>
  );
};

export default ToggleButton;
