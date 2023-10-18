"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Input,
  ButtonSecondary,
  FormItem,
  ToggleButton,
  ModalHeader,
} from "@/components/atoms";
import * as Yup from "yup";
import { ICreateCoupon } from "@/types/coupons";
import couponService from "@/service/coupons.service";
import { showToastify } from "@/hooks/showToastify";

const CreateCoupon = () => {
  const [loading, setLoading] = useState(false);
  const [couponsUnlimited, setCouponsUnlimited] = useState(true);
  const [unlimitedByUser, setUnlimitedByUser] = useState(true);

  const CreateCouponValidationSchema = Yup.object().shape({
    title: Yup.string().required("Título requerido."),
    discount: Yup.string().required("Selecione um desconto de 5% até 100%."),
    maxTotal: Yup.string().required(
      "Limite de cupons que podem ser utilizados.",
    ),
    maxPerUser: Yup.string().required("Limite de cupons por usuário."),
    expirationGenerationDate: Yup.date()
      .required("Data de validade para geração do cupom.")
      .min(new Date(), "Selecione uma data maior que a atual"),
    expirationUseDate: Yup.date()
      .required("Data limite para utilização do cupom.")
      .min(new Date(), "Selecione uma data maior que a atual"),
  });

  const couponSuccessRedirect = () => {
    showToastify({ label: "cupom gerado com sucesso", type: "success" });
    setTimeout(() => {
      setLoading(false);
      window.location.reload();
    }, 2000);
  };

  const handleFormSubmit = async (values: ICreateCoupon) => {
    setLoading(true);
    const data = {
      title: values.title,
      discount: String(values.discount),
      maxPerUser: unlimitedByUser ? -1 : Number(values.maxPerUser),
      maxTotal: couponsUnlimited ? -1 : Number(values.maxTotal),
      expirationGenerationDate: new Date(values.expirationGenerationDate),
      expirationUseDate: new Date(values.expirationUseDate),
    };
    await couponService
      .createCoupon(data)
      .then(() => couponSuccessRedirect())
      .catch((error) => {
        if (error?.response?.data?.code === 400) {
          showToastify({
            label:
              "Ocorreu um erro ao criar cupom. Por favor verificar os campos.",
            type: "error",
          });
        }
        if (error?.response?.data?.code === 401) {
          showToastify({
            label: "Você não tem permisão para criar cupom.",
            type: "error",
          });
        }
      })
      .finally(() => setLoading(false));
    return values;
  };

  return (
    <div className="w-full">
      <ModalHeader label="Criar Cupom" />
      <Formik
        validateOnBlur={false}
        initialValues={{
          title: "",
          discount: "20",
          maxTotal: -1,
          maxPerUser: -1,
          expirationGenerationDate: new Date("2022-01-01"),
          expirationUseDate: new Date("2022-01-01"),
        }}
        validationSchema={CreateCouponValidationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, isValidating, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <FormItem
              className="w-32 !text-3xl py-3 flex items-center justify-center font-semibold rounded-full border-[1px] border-black"
              label={values.discount + "%"}
              errorMessage={errors.discount}
              invalid={!!(errors.discount && touched.discount)}
            >
              <Field
                invalid={!!(errors.discount && touched.discount)}
                className="accent-primary-main !focus:border-none !hover:border-none focus:ring-0"
                name="discount"
                min="5"
                max="95"
                step="1"
                type="range"
                label="discount"
                component={Input}
              />
            </FormItem>
            <FormItem
              label="Título do cupom"
              errorMessage={errors.title}
              invalid={!!(errors.title && touched.title)}
            >
              {!!isValidating && <ErrorMessage name="title" />}
              <Field
                invalid={!!(errors.title && touched.title)}
                name="title"
                type="text"
                label="title"
                component={Input}
                className="bg-white"
              />
            </FormItem>
            <div className="grid grid-cols-2 w-full">
              <FormItem
                label="Limite de cupons"
                errorMessage={!couponsUnlimited && errors.maxTotal}
                invalid={
                  !couponsUnlimited && !!(errors.maxTotal && touched.maxTotal)
                }
              >
                <Field
                  disabled={couponsUnlimited}
                  invalid={
                    !couponsUnlimited && !!(errors.maxTotal && touched.maxTotal)
                  }
                  name="maxTotal"
                  value={couponsUnlimited ? "ilimitado" : values.maxTotal}
                  type="text"
                  label="maxTotal"
                  component={Input}
                  className="bg-white disabled:bg-white"
                />
              </FormItem>
              <FormItem
                label="Limite por usuário"
                errorMessage={!unlimitedByUser && errors.maxPerUser}
                invalid={
                  !unlimitedByUser &&
                  !!(errors.maxPerUser && touched.maxPerUser)
                }
              >
                <Field
                  disabled={unlimitedByUser}
                  invalid={
                    !unlimitedByUser &&
                    !!(errors.maxPerUser && touched.maxPerUser)
                  }
                  name="maxPerUser"
                  value={unlimitedByUser ? "ilimitado" : values.maxPerUser}
                  type="text"
                  label="maxPerUser"
                  component={Input}
                  className="bg-white disabled:bg-white"
                />
              </FormItem>
              <div>
                <ToggleButton
                  onClick={() => setCouponsUnlimited(!couponsUnlimited)}
                  toggle={couponsUnlimited}
                  label="ilimitado"
                />
              </div>
              <div>
                <ToggleButton
                  onClick={() => setUnlimitedByUser(!unlimitedByUser)}
                  toggle={unlimitedByUser}
                  label="ilimitado"
                />
              </div>
            </div>
            <FormItem
              label="Cupom ativo até..."
              errorMessage={errors.expirationGenerationDate}
              invalid={
                !!(
                  errors.expirationGenerationDate &&
                  touched.expirationGenerationDate
                )
              }
            >
              <Field
                invalid={
                  !!(
                    errors.expirationGenerationDate &&
                    touched.expirationGenerationDate
                  )
                }
                name="expirationGenerationDate"
                type="date"
                label="expirationGenerationDate"
                component={Input}
                className="bg-white cursor-pointer"
              />
            </FormItem>
            <FormItem
              label="Validade para o uso"
              errorMessage={errors.expirationUseDate}
              invalid={
                !!(errors.expirationUseDate && touched.expirationUseDate)
              }
            >
              <Field
                invalid={
                  !!(errors.expirationUseDate && touched.expirationUseDate)
                }
                name="expirationUseDate"
                type="date"
                label="expirationUseDate"
                component={Input}
                className="bg-white cursor-pointer"
              />
            </FormItem>
            <ButtonSecondary
              type="submit"
              className="w-full mt-20"
              disabled={loading}
              loading={loading}
            >
              Salvar cupom
            </ButtonSecondary>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateCoupon;
