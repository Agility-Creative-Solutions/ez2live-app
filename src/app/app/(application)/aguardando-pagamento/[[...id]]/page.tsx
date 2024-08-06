"use client";
import React, { useEffect, useState } from "react";
import {
  ButtonFourth,
  ButtonPrimary,
  LoadingPayment,
  SimpleModal,
} from "@/components";
import Image from "next/image";
import QrCodeSimpleIcon from "@/images/easytolive/payment/qr-code-simple-icon.svg";
import PixSimpleIcon from "@/images/easytolive/payment/pix-simple-icon.svg";
import PixImage from "@/images/easytolive/payment/pix-image.svg";
import { PAYMENT } from "@/constants/paymentMethods";
import { copyTextToClipboard } from "@/utils/copyTextToClipboard";
import subscriptionService from "@/service/subscription.service";
import { showToastify } from "@/hooks/showToastify";
import { IPaymentResponseData } from "@/types/payment";
import { INVOICE_STATUS } from "@/constants/payment";
import { useRouter } from "next/navigation";
import { Route } from "next";

interface IWaitingApprovalPageProps {
  params: {
    id?: string;
  };
}

const WaitingApprovalPage: React.FC<IWaitingApprovalPageProps> = ({
  params,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const { id } = params;

  const [paymentResponseData, setPaymentResponseData] =
    useState<IPaymentResponseData>({
      invoiceId: "",
      secureUrl: "",
      qrCodeValue: {
        image: "",
        text: "",
      },
    });

  const handleInvoiceResponse = (res: any) => {
    const { status, id, secureUrl, payableWith, pix } = res.data;

    switch (status) {
      case INVOICE_STATUS.PENDING:
        setPaymentMethod(payableWith);
        setPaymentResponseData({
          invoiceId: id,
          secureUrl: secureUrl,
          ...(payableWith === PAYMENT.pix && {
            qrCodeValue: {
              image: pix.qrcode,
              text: pix.qrcodeText,
            },
          }),
        });
        setLoading(false);
        break;

      case INVOICE_STATUS.PAID:
        router.push(`/app/pagamento?step=aprovado`);
        break;

      case INVOICE_STATUS.CANCELLED:
        router.push(`/app/pagamento?step=recusado`);
        break;

      default:
        break;
    }
  };

  const getLastInvoice = async () => {
    subscriptionService
      .getLastInvoice()
      .then((res) => handleInvoiceResponse(res))
      .catch(() => {
        router.push(`/app/pagamento?step=recusado`);
      });
  };

  const getInvoiceById = async (invoiceId: string) => {
    subscriptionService
      .getInvoiceById(invoiceId)
      .then((res) => handleInvoiceResponse(res))
      .catch(() => {
        router.push(`/app/pagamento?step=recusado`);
      });
  };

  const handleClickCopyText = (textToCopy: string) => {
    try {
      copyTextToClipboard(textToCopy);
      showToastify({
        label: "Texto copiado com sucesso para area de transferencia",
        type: "success",
      });
    } catch (error) {
      showToastify({
        label: "Falha ao copiar texto para aréa de transferência.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    const fetchInvoice = () => {
      if (id) {
        getInvoiceById(id);
      } else {
        getLastInvoice();
      }
    };

    fetchInvoice();

    const interval = setInterval(fetchInvoice, 30 * 1000);

    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className="bg-generic-gray h-full min-h-[calc(100vh-66px)] px-4 flex flex-col pt-14 items-center">
      <LoadingPayment paymentMethod={paymentMethod} />
      {!loading &&
        (paymentMethod === PAYMENT.pix && paymentResponseData.qrCodeValue ? (
          <div>
            <SimpleModal className="pb-6">
              <div className="w-full flex justify-center my-1">
                <Image alt="Pix Image" src={PixImage} width={82} height={33} />
              </div>
              <p className="font-bold text-xs text-generic-dark">QR Code</p>
              <Image
                src={paymentResponseData.qrCodeValue.image}
                alt="pix-image"
                className="w-32 h-32"
                height={128}
                width={128}
              />

              <div>
                <p className="font-bold text-center pb-1 text-generic-dark mt-5 text-xs">
                  Copia e Cola
                </p>
                <p className="text-xs mb-2 break-words md:max-w-[340px]">
                  {paymentResponseData.qrCodeValue.text}
                </p>
              </div>

              <ButtonFourth
                onClick={() => {
                  if (paymentResponseData?.qrCodeValue?.text) {
                    handleClickCopyText(paymentResponseData.qrCodeValue.text);
                  }
                }}
                className="!border-generic-limeGreen !border-[1px] !py-1 !text-xs  !text-generic-limeGreen"
              >
                Copiar Código PIX
              </ButtonFourth>
            </SimpleModal>
            <SimpleModal className="flex text-xs flex-col px-5 justify-start items-baseline">
              <p className="text-sm font-bold">
                Você tem duas formas de fazer a transferência:
              </p>
              <Image
                alt="qr-code-simple-icon"
                src={QrCodeSimpleIcon}
                width={13}
                height={21}
              />
              <h4 className="font-bold">PIX QR code</h4>
              <ol className="list-decimal px-3">
                <li>
                  Abra o site ou aplicativo do seu banco e selecione a opção PIX
                </li>
                <li>Escolha pagar com QR code</li>
                <li>Aponte sua câmera para o QR code exibido na tela</li>
                <li>Tudo certo! Confira os dados e finalize o pagamento</li>
              </ol>
              <Image
                alt="qr-code-simple-icon"
                src={PixSimpleIcon}
                width={13}
                height={21}
              />
              <h4 className="font-bold">Instruções de pagamento PIX</h4>
              <ol className="list-decimal px-3">
                <li>Clique no botão “copiar código”</li>
                <li>
                  Abra o site ou aplicativo do seu banco e selecione a opção PIX
                </li>
                <li>Selecione a opção “Copia e cola” e insira o código</li>
                <li>Tudo certo! Confira os dados e finalize o pagamento</li>
              </ol>
            </SimpleModal>
          </div>
        ) : (
          <SimpleModal className="text-center space-y-3 px-4">
            <p className="font-semibold">
              Aguarde enquanto verificamos os detalhes do seu pagamento.
            </p>
            <span className="text-sm">
              Caso deseje mais informações sobre sua fatura ou alterar o meio de
              pagamento, clique no botão abaixo.
            </span>
            <ButtonPrimary
              href={paymentResponseData.secureUrl as Route}
              targetBlank={true}
            >
              Ver fatura
            </ButtonPrimary>
            <span className="leading-3 text-[10px] italic">
              Para concluir seu pagamento pendente, clique no botão Ver Fatura
              acima e selecione uma nova forma de pagamento. Após concluir, você
              poderá retornar a Easy!
            </span>
          </SimpleModal>
        ))}
    </div>
  );
};

export default WaitingApprovalPage;
