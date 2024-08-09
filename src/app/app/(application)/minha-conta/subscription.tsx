import React, { useState } from "react";
import Image from "next/image";
import EasyLogo from "@/images/easytolive/logo/logotipo-semfundoazulroxo.svg";
import {
  ButtonPrimary,
  ButtonThird,
  LoadingComponent,
  Modal,
  CreditCard,
  AddPaymentMethod,
} from "@/components";
import { showToastify } from "@/hooks/showToastify";
import { Session } from "next-auth";
import { getDateFormater } from "@/utils/getDateFormater";
import {
  IGetPaymentMethodResponse,
  IGetSubscriptionResponse,
} from "@/types/subscription/response/index";
import subscriptionService from "@/service/subscription.service";

interface SubscriptionProps {
  session: Session | null;
  subscriptionInfo?: IGetSubscriptionResponse;
  paymentMethodInfo?: IGetPaymentMethodResponse;
  handlePaymentMethodInfo: (e: any) => void;
}

export const SubscriptionTab: React.FC<SubscriptionProps> = ({
  session,
  subscriptionInfo,
  paymentMethodInfo,
  handlePaymentMethodInfo,
}) => {
  const [isCancelSubscriptionModalOpen, setIsCancelSubscriptionModalOpen] =
    useState(false);
  const [isDeletePaymentMethodModalOpen, setIsDeletePaymentMethodModalOpen] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [hasSubscriptionSuspensed, setHasSubscriptionSuspensed] =
    useState(false);

  const suspendSubscription = async () => {
    const res = await subscriptionService.suspendSubscription();
    return res;
  };

  const handleDeletePaymentMethod = async () => {
    await subscriptionService
      .deletePaymentMethod()
      .then(() => {
        showToastify({
          type: "success",
          label: "Seu cartão de crédito foi removido.",
        });
        handlePaymentMethodInfo(null);
        setIsDeletePaymentMethodModalOpen(false);
      })
      .catch(() =>
        showToastify({
          type: "error",
          label:
            "Ocorreu um erro ao remover seu método de pagamento. Verifique se o mesmo já não foi removido",
        }),
      );
  };

  const handleCancelSubscription = () => {
    setLoading(true);
    suspendSubscription()
      .then(() => {
        showToastify({
          label: `O ciclo da sua fatura será encerrado no dia ${subscriptionInfo?.expiresAt}. Até lá você pode aproveitar nossos descontos!`,
          type: "success",
        });
      })
      .then(() => setHasSubscriptionSuspensed(true))
      .then(() => setIsCancelSubscriptionModalOpen(false));
    setLoading(false);
  };
  const hasSubscriptionId = session?.user.iuguSubscriptionId;
  const hasIuguId = !!session?.user?.iuguCustomerId;

  return hasIuguId && hasSubscriptionId ? (
    <div className="px-4">
      <Modal
        closeOnBlur={true}
        hasCloseButton={true}
        show={isDeletePaymentMethodModalOpen}
        onCloseModal={() => setIsDeletePaymentMethodModalOpen(false)}
      >
        <div className="flex flex-col items-center justify-center space-y-3 text-center px-6 pt-6">
          <p className="py-2 px-4">
            Ao remover o cartão principal de pagamento, suas próximas faturas
            terão que ser pagas manualmente.
          </p>
          <ButtonPrimary
            onClick={() => handleDeletePaymentMethod()}
            className="!bg-generic-alertRed !text-xs !py-2 !px-4 font-extrabold"
          >
            {loading ? "cancelando  (...)" : "Remover método de pagamento"}
          </ButtonPrimary>
          <ButtonThird
            className="!text-black !mt-0 !text-sm !font-extrabold"
            onClick={() => setIsDeletePaymentMethodModalOpen(false)}
          >
            cancelar
          </ButtonThird>
        </div>
      </Modal>
      <Modal
        closeOnBlur={true}
        hasCloseButton={true}
        show={isCancelSubscriptionModalOpen}
        onCloseModal={() => setIsCancelSubscriptionModalOpen(false)}
      >
        <div className="flex flex-col items-center justify-center space-y-3 text-center px-6 pt-6">
          <h2 className="text-xl font-extrabold m-1">
            Tem certeza que você quer <br /> deixar de economizar?
          </h2>
          <p className="text-sm font-medium">
            {"Se você cancelar a assinatura "}
            <strong>
              perderá <br /> o acesso aos melhores descontos
            </strong>
            que <br /> selecionamos para você!
          </p>
          <p className="text-sm font-medium">
            Você pode cancelar a qualquer <br /> momento e encerrar a
            recorrência do <br />
            ciclo em{" "}
            <strong>{getDateFormater(subscriptionInfo?.expiresAt)}</strong>
          </p>
          <p className="text-sm font-medium">
            <strong>Até lá, você ainda pode aproveitar</strong>
            <br /> nossos melhores descontos.
          </p>
          <ButtonPrimary
            onClick={() => handleCancelSubscription()}
            className="!bg-generic-alertRed !text-xs !py-2 !px-4 font-extrabold"
          >
            {loading ? "cancelando  (...)" : "Cancelar assinatura"}
          </ButtonPrimary>
          <ButtonThird
            className="!text-generic-limeGreen mt-2 !text-sm font-extrabold"
            onClick={() => setIsCancelSubscriptionModalOpen(false)}
          >
            Permanecer Assinante Easy
          </ButtonThird>
        </div>
      </Modal>
      {subscriptionInfo ? (
        <div className="text-sm grid items-center grid-cols-2 gap-3 md:gap-2 md:flex md:flex-col md:justify-center md:text-center">
          <div>
            <p className="font-bold">Status Assiantura</p>
            <span>
              {subscriptionInfo?.active ? (
                <p className="text-generic-alertGreen font-semibold">Ativa</p>
              ) : (
                <p className="font-semibold"> Inativa</p>
              )}
            </span>
          </div>
          <div>
            <p className="font-bold">Última cobrança</p>
            <span className="font-semibold text-generic-dark">
              {getDateFormater(subscriptionInfo?.cycledAt)}
            </span>
          </div>
          <div>
            <p className="font-bold">Plano</p>
            <span className="font-semibold text-generic-dark">
              {subscriptionInfo?.planName}
            </span>
          </div>
          <div>
            <p className="font-bold">ID da assinatura</p>
            <span className="font-semibold text-generic-dark break-words">
              {subscriptionInfo?.id}
            </span>
          </div>
          <div>
            <p className="font-bold">Próxima cobrança</p>
            <span className="font-semibold text-generic-dark">
              {getDateFormater(subscriptionInfo?.expiresAt)}
            </span>
          </div>
          {subscriptionInfo?.suspended || hasSubscriptionSuspensed ? (
            <p className="font-medium text-xs italic">
              Sua assinatura foi suspensa e não renovará automaticamente.{" "}
            </p>
          ) : (
            <ButtonThird
              className="!text-generic-alertRed !p-0 mt-8"
              onClick={() => setIsCancelSubscriptionModalOpen(true)}
            >
              Cancelar Assinatura
            </ButtonThird>
          )}
          {
            <div className="w-full mx-auto flex col-span-2 flex-col md:max-w-80 max-w-lg px-4 md:px-3 justify-center text-center items-center space-y-2 mt-12">
              <p className="font-bold">Meio de pagamento salvo</p>
              <p className="text-generic-dark text-xs">
                Nós não salvamos dados sensíveis do cartão de crédito, apenas o
                dado criptografado necessário para realizar o pagamento.
              </p>
              <div className="w-full flex justify-center">
                {paymentMethodInfo?.data ? (
                  <div>
                    <div className="py-2 w-full flex justify-center">
                      <CreditCard
                        cardFlag={paymentMethodInfo.data.brand}
                        year={paymentMethodInfo.data.year}
                        month={paymentMethodInfo.data.month}
                        lastNumbers={paymentMethodInfo.data.lastDigits}
                        nameOnCard={paymentMethodInfo.data.holderName}
                      />
                    </div>

                    <ButtonThird
                      className="!text-generic-alertRed !p-0"
                      onClick={() => setIsDeletePaymentMethodModalOpen(true)}
                    >
                      Excluir cartão principal
                    </ButtonThird>
                    <p className="text-generic-dark text-xs italic">
                      Ao remover o cartão principal de pagamento, suas próximas
                      faturas terão que ser pagas manualmente.
                    </p>
                  </div>
                ) : (
                  <AddPaymentMethod
                    handlePaymentMethodInfo={handlePaymentMethodInfo}
                  />
                )}
              </div>
            </div>
          }
        </div>
      ) : (
        <LoadingComponent size="large" fullSize={false} />
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center text-center">
      <Image src={EasyLogo} width={40} height={40} alt="logo-image" />
      <h2 className="text-lg font-semibold mb-2 mt-4">
        Você está a um passo de <br /> economizar ainda mais!
      </h2>
      <p className="text-sm font-medium">
        Seja um assinante Easy To Live e tenha acesso <br />
        aos melhores descontos em nosso app
      </p>
      <ButtonPrimary
        href="/app/pagamento"
        className="!bg-generic-limeGreen mt-8 !px-4 !py-2 !text-xs !font-extraboldbold"
      >
        Quero os melhores descontos
      </ButtonPrimary>
    </div>
  );
};
