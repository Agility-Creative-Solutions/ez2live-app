"use client";

import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react";

interface ICompleteSupplierRegisterContext extends PropsWithChildren {
  isUpdate: boolean;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CompleteSupplierRegisterContext =
  createContext<ICompleteSupplierRegisterContext>(
    {} as ICompleteSupplierRegisterContext,
  );

export const useCompleteSupplierRegister = () =>
  useContext(CompleteSupplierRegisterContext);

export const CompleteSupplierRegisterProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [isUpdate, setUpdate] = useState(false);

  return (
    <CompleteSupplierRegisterContext.Provider value={{ isUpdate, setUpdate }}>
      {children}
    </CompleteSupplierRegisterContext.Provider>
  );
};
