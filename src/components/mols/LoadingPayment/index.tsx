import { LoadingComponent, SimpleModal } from "@/components/atoms";
import { PAYMENT } from "@/constants/paymentMethods";
import React from "react";

interface LoadingPaymentModalComponentProps {
  paymentMethod: string;
}

const LoadingPaymentModal: React.FC<LoadingPaymentModalComponentProps> = ({
  paymentMethod,
}) => {
  return (
    <SimpleModal className="text-center">
      <LoadingComponent fullSize={false} size="medium" bgStyle="none" />
      <p className="text-xl text-center font-extrabold mt-2">
        Aguardando Pagamento
      </p>
      {paymentMethod === PAYMENT.pix && (
        <p className="text-center mb-4">
          Sua assinatura será confirmada após a identificação da transferência
          pelo nosso sistema
        </p>
      )}
      {paymentMethod === PAYMENT.creditCard && (
        <div>
          <p className="text-sm my-4">
            Seu pagamento está sendo processado. Não atualize nem feche esta
            página até que o processo seja concluído...
          </p>
          <p className="text-sm">Agradecemos sua paciência!</p>
        </div>
      )}
    </SimpleModal>
  );
};

export default LoadingPaymentModal;
