import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import InvoiceWarningIcon from "@/images/easytolive/icons/invoice-warning.svg";

const PaymentPending = () => {
  const route = useRouter();

  return (
    <div
      className="relative flex justify-center items-center px-2"
      onClick={() => route.push("/app/aguardando-pagamento")}
    >
      <div className="group">
        <Image
          src={InvoiceWarningIcon}
          alt="payment-warning-icon"
          className="cursor-pointer h-5 w-auto"
        />
        <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-40 bg-gray-400 text-black text-center text-sm rounded py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Você possui faturas em aberto.
        </span>
      </div>
    </div>
  );
};

export default PaymentPending;
