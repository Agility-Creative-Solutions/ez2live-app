import React from "react";
import { ButtonPrimary, SimpleModal } from "@/components";
import Image from "next/image";
import RefusedIcon from "@/images/easytolive/icons/refused-icon.svg";

export const RejectedPaymentStep = () => {
  return (
    <div className="flex flex-col items-center">
      <SimpleModal className="text-center">
        <Image alt="refused-icon" src={RefusedIcon} width={70} height={70} />
        <p className="text-xl font-extrabold"> Oooops, algo deu errado...</p>
        <p className="text-sm font-medium">
          Sua assinatura não pôde ser confirmada.
        </p>
        <p className="text-sm font-medium">
          Verifique os detalhes do seu cartão e <br />
          tente novamente ou confira outra forma <br />
          de pagamento.
        </p>
      </SimpleModal>
      <ButtonPrimary href="/app/pagamento" className="w-full">
        Tentar Novamente
      </ButtonPrimary>
    </div>
  );
};
