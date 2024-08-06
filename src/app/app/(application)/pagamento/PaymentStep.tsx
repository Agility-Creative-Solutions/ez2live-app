"use client";

import {
  CreditCardPayment,
  OneStepToPayment,
  PixPayment,
  SimpleModal,
  PaymentMethod,
  LoadingComponent,
} from "@/components";
import { INVOICE_STATUS } from "@/constants/payment";
import { PAYMENT } from "@/constants/paymentMethods";
import subscriptionService from "@/service/subscription.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IPaymentStepProps {
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  paymentTab: string;
  setPaymentTab: React.Dispatch<React.SetStateAction<string>>;
}

export const PaymentStep: React.FC<IPaymentStepProps> = ({
  setCurrentStep,
  paymentTab,
  setPaymentTab,
}) => {
  const [loading, setLoading] = useState(true);
  const route = useRouter();

  const getLastInvoiceInfo = async () => {
    subscriptionService
      .getLastInvoice()
      .then((res: any) => {
        if (res.data.status === INVOICE_STATUS.PENDING) {
          route.push("/app/aguardando-pagamento");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getLastInvoiceInfo();
  }, []);

  return (
    <div>
      {loading ? (
        <LoadingComponent fullSize={true} size="medium" />
      ) : (
        <div>
          <OneStepToPayment />
          <SimpleModal className="!p-0">
            <PaymentMethod
              paymentTab={paymentTab}
              SetPaymentTab={setPaymentTab}
            />
            {paymentTab === PAYMENT.creditCard ? (
              <CreditCardPayment currentStepPayment={setCurrentStep} />
            ) : (
              <PixPayment currentStepPayment={setCurrentStep} />
            )}
          </SimpleModal>
        </div>
      )}
    </div>
  );
};
