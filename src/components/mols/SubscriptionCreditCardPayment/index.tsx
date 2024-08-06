"use client";
import React, { useState } from "react";
import { ICreditCardPayment } from "@/types/payment";
import useIugu from "@/payment/iugu";
import subscriptionService from "@/service/subscription.service";
import { useSession } from "next-auth/react";
import { showToastify } from "@/hooks/showToastify";
import { INVOICE_STATUS, SUBSCRIPTION_STATUS } from "@/constants/payment";
import { CreditCardForm } from "@/components";
import { useRouter } from "next/navigation";

interface ICreditCardPaymentProps {
  currentStepPayment: React.Dispatch<React.SetStateAction<number>>;
}

const CreditCardPayment: React.FC<ICreditCardPaymentProps> = ({
  currentStepPayment,
}) => {
  const [loading, setLoading] = useState(false);
  const Iugu = useIugu(process.env.NEXT_PUBLIC_IUGU_ID);
  const { data: session, update } = useSession();
  const route = useRouter();

  const updateSession = async (responseData: any) => {
    const {
      subscriptionResponse: { subscriptionId },
      user: { iuguCustomerId, iuguPaymentMethodId },
    } = responseData;

    await update({
      ...session,
      user: {
        ...session?.user,
        subscriptionStatus: SUBSCRIPTION_STATUS.PREMIUM,
        iuguCustomerId,
        iuguPaymentMethodId,
        iuguSubscriptionId: subscriptionId,
      },
    });
  };

  const handlePaymentStatus = async (res: any) => {
    const { paymentStatus } = res.data.subscriptionResponse;

    switch (paymentStatus) {
      case INVOICE_STATUS.PAID:
        updateSession(res.data);
        currentStepPayment(2);
        break;
      case INVOICE_STATUS.PENDING:
        route.push(
          `/app/aguardando-pagamento?invoice=${paymentStatus.recentInvoiceId}`,
        );
        break;
      case INVOICE_STATUS.CANCELLED:
        showToastify({
          label:
            "Seu cartão foi recusado. Verifique os dados e tente novamente.",
        });
        return currentStepPayment(0);
      default:
        currentStepPayment(1);
    }
  };

  const handleSubmit = async (values: ICreditCardPayment) => {
    const fragmentedName = values.fullName.split(" ");
    const firstName = fragmentedName[0];
    const lastName = fragmentedName.slice(1).join(" ");
    const iuguData = {
      number: values.creditCard,
      first_name: firstName,
      last_name: lastName,
      full_name: values.fullName,
      verification_value: values.cvv,
      month: values.cardMonth,
      year: values.cardYear,
    };
    setLoading(true);
    const testMode = !!Number(process.env.NEXT_PUBLIC_TEST_MODE);
    Iugu.setTestMode(testMode);
    const iuguJsToken = await Iugu.createPaymentToken(iuguData);
    await subscriptionService
      .createSubscriptionCreditCard(iuguJsToken.id)
      .then((res: any) => {
        handlePaymentStatus(res);
      })
      .catch((res: any) => {
        if (res.status === 400) {
          showToastify({
            label:
              "O pagamento foi recusado. Por favor, verifique os dados do cartão e tente novamente.",
            type: "error",
          });
        }
        currentStepPayment(0);
      });

    setLoading(false);
  };

  return (
    <CreditCardForm
      loading={loading}
      handleSubmit={handleSubmit}
      buttonLabel="Efetuar Pagamento"
      loadingButonLabel="Aguardando pagamento"
    />
  );
};

export default CreditCardPayment;
