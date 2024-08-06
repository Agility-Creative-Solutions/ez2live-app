"use client";
import React, { useEffect, useState } from "react";
import { PaymentStep } from "./PaymentStep";
import { AcceptedPaymentStep } from "./AcceptedPaymentStep";
import { RejectedPaymentStep } from "./RejectedPaymentStep";
import { PAYMENT } from "@/constants/paymentMethods";
import { useSearchParams } from "next/navigation";

const PaymentPage = () => {
  const STEPS = {
    PAYMENT: 0,
    PAYMENT_ACCEPT: 2,
    PAYMENT_REJECT: 3,
  };

  const [currentStep, setCurrentStep] = useState<number>(STEPS.PAYMENT);
  const [paymentTab, setPaymentTab] = useState(PAYMENT.creditCard);
  const params = useSearchParams();
  const paymentStep = params.get("step");

  useEffect(() => {
    switch (paymentStep) {
      case "aprovado":
        setCurrentStep(STEPS.PAYMENT_ACCEPT);
        break;
      case "recusado":
        setCurrentStep(STEPS.PAYMENT_REJECT);
        break;
      default:
        setCurrentStep(STEPS.PAYMENT);
        break;
    }
  }, [paymentStep, STEPS.PAYMENT, STEPS.PAYMENT_ACCEPT, STEPS.PAYMENT_REJECT]);

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.PAYMENT:
        return (
          <PaymentStep
            paymentTab={paymentTab}
            setPaymentTab={setPaymentTab}
            setCurrentStep={setCurrentStep}
          />
        );
      case STEPS.PAYMENT_ACCEPT:
        return <AcceptedPaymentStep />;
      case STEPS.PAYMENT_REJECT:
        return <RejectedPaymentStep />;
      default:
        return (
          <PaymentStep
            paymentTab={paymentTab}
            setPaymentTab={setPaymentTab}
            setCurrentStep={setCurrentStep}
          />
        );
    }
  };

  return (
    <div className="bg-generic-gray h-full min-h-[calc(100vh-66px)] px-4 flex flex-col pt-14 items-center">
      {renderStep()}
    </div>
  );
};

export default PaymentPage;
