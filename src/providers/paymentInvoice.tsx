"use client";

import { INVOICE_STATUS } from "@/constants/payment";
import { ROLES } from "@/constants/roles";
import subscriptionService from "@/service/subscription.service";
import { useSession } from "next-auth/react";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface IPaymentInvoiceProviderProps {
  children: React.ReactNode;
}

interface IPaymentInvoiceContextData {
  hasPaymentPending: boolean;
  setHasPaymentPending: Dispatch<SetStateAction<boolean>>;
}

export const PaymentInvoiceContext = createContext<IPaymentInvoiceContextData>(
  {} as IPaymentInvoiceContextData,
);

export const usePaymentInvoiceContext = () => useContext(PaymentInvoiceContext);

export const PaymentInvoiceProvider: React.FC<IPaymentInvoiceProviderProps> = ({
  children,
}) => {
  const [hasPaymentPending, setHasPaymentPending] = useState(false);
  const { data: session } = useSession();

  const getLastInvoice = () => {
    subscriptionService.getLastInvoice().then((res: any) => {
      if (res.data.status === INVOICE_STATUS.PENDING) {
        setHasPaymentPending(true);
      }
    });
  };

  useEffect(() => {
    if (session?.user.role === ROLES.commonUser) getLastInvoice();
  }, []);

  return (
    <PaymentInvoiceContext.Provider
      value={{
        hasPaymentPending,
        setHasPaymentPending,
      }}
    >
      {children}
    </PaymentInvoiceContext.Provider>
  );
};
