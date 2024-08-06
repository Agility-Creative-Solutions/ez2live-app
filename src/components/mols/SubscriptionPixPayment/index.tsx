"use client";
import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Input, ButtonPrimary, FormItem } from "@/components";
import * as Yup from "yup";
import Image from "next/image";
import PixImage from "@/images/easytolive/payment/pix-image.svg";
import { IPixPayment } from "@/types/payment";
import subscriptionService from "@/service/subscription.service";
import { useSession } from "next-auth/react";
import { showToastify } from "@/hooks/showToastify";
import { useRouter } from "next/navigation";

interface IPixPaymentProps {
  currentStepPayment: React.Dispatch<React.SetStateAction<number>>;
}

const PixPayment: React.FC<IPixPaymentProps> = ({ currentStepPayment }) => {
  const [loading, setLoading] = useState(false);
  const { data: session, update } = useSession();
  const route = useRouter();
  const updateSession = async (responseData: any) => {
    await update({
      ...session,
      user: {
        ...session?.user,
        iuguCustomerId: responseData.iuguCustomerId,
      },
    });
  };

  const PixPaymentValidationSchema = Yup.object().shape({
    cpf: Yup.string().required("CPF inválido"),
    termsOfUse: Yup.boolean()
      .required()
      .oneOf(
        [true],
        "Você precisa concordar com os termos de uso para prosseguir.",
      ),
  });

  const handleSubmit = async (values: IPixPayment) => {
    setLoading(true);
    await subscriptionService
      .createSubscriptionPix(values.cpf)
      .then((res: any) => {
        updateSession(res.data.user);
        route.push(
          `/app/aguardando-pagamento?invoice=${res.data.subscriptionResponse.recentInvoiceId}`,
        );
      })
      .catch((res: any) => {
        if (res.status === 400) {
          showToastify({
            label:
              "Você está tentando criar uma nova assinatura, mas já possui uma ativa.",
            type: "error",
          });
        } else {
          currentStepPayment(3);
        }
      });
  };

  const initialValues: IPixPayment = {
    cpf: "",
    termsOfUse: true,
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={PixPaymentValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, errors, touched, handleSubmit }) => (
        <Form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between px-4 my-4 min-h-[406px]"
        >
          <div>
            <div className="w-full flex justify-center mb-5">
              <div className="h-10">
                <Image alt="Pix Image" src={PixImage} />
              </div>
            </div>
            <FormItem
              errorMessage={errors.cpf}
              invalid={!!(errors.cpf && touched.cpf)}
              className=""
            >
              <Field
                invalid={!!(errors.cpf && touched.cpf)}
                name="cpf"
                type="text"
                placeholder="CPF do comprador"
                component={Input}
              />
            </FormItem>
            <p className="text-xs">
              Pague direto da sua conta, de forma rápida e segura. O PIX permite
              transferência de dinheiro entre contas sem limite de horário, 24
              horas por dia, 7 dias por semana.
            </p>
            <p className="text-xs mb-1">
              Sua assinatura será confirmada após a identificação da
              transferência pelo nosso sistema.
            </p>
          </div>
          <div>
            <div className="flex gap-2">
              <FormItem
                errorMessage={null}
                invalid={!!(errors.termsOfUse && touched.termsOfUse)}
                className="flex"
                hasErrorSpacement={false}
              >
                <div className="flex w-full gap-1 items-center ">
                  <Field
                    invalid={!!(errors.termsOfUse && touched.termsOfUse)}
                    name="termsOfUse"
                    type="checkbox"
                    className="!w-4 !h-4 !rounded-none !p-0 !m-0"
                    component={Input}
                    checked={values.termsOfUse}
                    onChange={(e: any) => {
                      setFieldValue("termsOfUse", e.target.checked);
                    }}
                  ></Field>
                  <label
                    htmlFor="termsOfUse"
                    className="text-[10px] w-full leading-3"
                    onClick={() =>
                      setFieldValue("termsOfUse", !values.termsOfUse)
                    }
                  >
                    Ao realizar a assinatura você concorda com os Termos de Uso
                  </label>
                </div>
              </FormItem>
            </div>

            <ButtonPrimary
              loading={loading}
              disabled={loading}
              className="w-full my-2"
            >
              {loading ? "Realizando pagamento" : "Efetuar Pagamento"}
            </ButtonPrimary>
            <p className="text-[10px] leading-3 italic text-center">
              Os pagamentos serão realizados de forma recorrente a cada
              renovoção. Você poderá cancelar a qualquer momento em seu perfil.
            </p>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PixPayment;
