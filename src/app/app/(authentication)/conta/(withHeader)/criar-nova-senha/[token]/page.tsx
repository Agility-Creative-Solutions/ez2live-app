"use client";

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Input, ButtonPrimary, FormItem } from "@/components";
import * as Yup from "yup";
import { IResetPasswordForm } from "@/types/auth/request";
import { useRouter } from "next/navigation";
import authService from "@/service/auth.service";
import { showToastify } from "@/hooks/showToastify";

interface ITokenProps {
  params: {
    token: string;
  };
}

const ResetPassword = ({ params }: ITokenProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const SignUpValidationSchema = Yup.object().shape({
    password: Yup.string()
      .matches(
        /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/,
        "Deve conter pelo menos uma letra e um número",
      )
      .required(
        "Coloque uma combinação de numeros, letras e sinais de pontuação (como ! e &).",
      )
      .min(8, "Senha deve conter no mínimo 8 caracteres.")
      .max(36, "Senha não deve contar mais de 36 caracteres"),
    conf_password: Yup.string()
      .required("Confirme sua senha.")
      .oneOf([Yup.ref("password")], "Senhas devem ser iguais."),
  });

  const initialValues: IResetPasswordForm = {
    password: "",
    conf_password: "",
  };

  const handleFormSubmit = async (values: IResetPasswordForm) => {
    setLoading(true);

    await authService
      .resetPassword({
        token: params.token,
        password: values.password,
      })
      .then(() => {
        showToastify({ label: "Senha alterada com sucesso!", type: "success" });
        setTimeout(() => router.push("/app/conta/entrar"), 2000);
      })
      .catch(() => {
        showToastify({
          label: "Oops! Algo deu errado. Verifique os campos e tente novamente",
          type: "error",
        });
        setLoading(false);
      });
  };

  return (
    <div className={`nc-PageSignUp `} data-nc-id="PageSignUp">
      <div className="container mb-8 lg:mb-32">
        <div className="mt-8 mb-16 flex items-center justify-between">
          <h2 className=" pl-6 flex items-center text-2xl leading-[115%] md:text-5xl md:leading-[115%] font-bold text-black dark:text-neutral-100 justify-center">
            Nova senha
          </h2>
          <div>
            <div className="relative rounded-full w-40 h-16 bg-gradient-to-r from-secondary-main to-secondary-ligther">
              <div className="absolute top-8 right-0 rounded-full w-16 h-16 bg-gradient-to-r from-secondary-main to-secondary-ligther"></div>
            </div>
          </div>
        </div>
        <div className="max-w-md mx-auto space-y-6 ">
          {/* FORM */}
          <Formik
            initialValues={initialValues}
            validationSchema={SignUpValidationSchema}
            onSubmit={handleFormSubmit}
          >
            {({ errors, touched, handleSubmit }) => (
              <Form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <FormItem
                  label="Nova senha"
                  errorMessage={errors.password}
                  invalid={!!(errors.password && touched.password)}
                >
                  <Field
                    invalid={!!(errors.password && touched.password)}
                    name="password"
                    type="password"
                    label="Password"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  label="Repetir nova senha"
                  errorMessage={errors.conf_password}
                  invalid={!!(errors.conf_password && touched.conf_password)}
                >
                  <Field
                    invalid={!!(errors.conf_password && touched.conf_password)}
                    name="conf_password"
                    type="password"
                    label="Password"
                    component={Input}
                  />
                </FormItem>
                <ButtonPrimary
                  type="submit"
                  className="w-full mt-6"
                  disabled={loading}
                  loading={loading}
                >
                  Criar nova senha
                </ButtonPrimary>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
