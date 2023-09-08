"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FormikProps } from "formik";
import { Input, ButtonPrimary, FormItem, Select } from "@/components/atoms";
import * as Yup from "yup";
import { IRegisterAccount } from "@/types/auth/request";
import { useRouter } from "next/navigation";
import Auth from "@/service/auth.service";
import Supplier from "@/service/supplier.service";
import { ICategoryProps } from "@/types/supplier";
import { showToastify } from "@/hooks/showToastify";
import { setItemToLocalStorage } from "@/utils/localStorageHelper";

export interface IStepOneProps {
  next: (e: any) => void;
  data: IRegisterAccount;
  key: number;
}

const FormComponent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [firstCategory, setFirstCategory] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [initialValues, setInitialValues] = useState({
    name: "",
    document: "",
    email: "",
    password: "",
    supplierCategory: firstCategory,
    isSupplier: true,
    address: {
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      zipcode: "",
    },
  });

  const getSupplierCatogires = async () => {
    const res: any = await Supplier.getSupplierCategories();
    return res;
  };

  useEffect(() => {
    getSupplierCatogires()
      .then((res) => {
        setCategories(res.data.supplierCategories.results),
          setFirstCategory(res.data.supplierCategories.results[0].id);
      })
      .catch((error) => {
        if (error?.response?.data?.code === 401) {
          showToastify({ label: "Usuário não autenticado.", type: "error" });
        }
        if (error?.response?.data?.code === 404) {
          showToastify({
            label: "Não foi encontrado nenhuma categoria.",
            type: "error",
          });
        }
      });
    setInitialValues((prev) => ({ ...prev, supplierCategory: firstCategory }));
  }, []);

  const FirstStepValidationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Nome muito curto!")
      .max(50, "Nome muito longo!")
      .required("Campo nome é requerido"),
    document: Yup.string()
      .min(14, "Muito curto!")
      .max(18, "Muito longo!")
      .required("Campo requerido"),
    supplierCategory: Yup.string()
      .nonNullable()
      .required("Escolha a categoria da empresa"),
    email: Yup.string().email("Email inválido").required("Email requerido"),
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
  });

  const SecondStepValidationSchema = Yup.object().shape({
    address: Yup.object().shape({
      street: Yup.string().required("Campo requerido"),
      number: Yup.string().required("Campo requerido"),
      neighborhood: Yup.string().required("Campo requerido"),
      city: Yup.string().required("Campo requerido"),
      state: Yup.string().required("Campo requerido"),
      zipcode: Yup.string().required("Campo requerido"),
    }),
  });

  const handleNextStep = (newData: Partial<IRegisterAccount>) => {
    setInitialValues((prev) => ({ ...prev, ...newData }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleFormSubmit = async (values: IRegisterAccount) => {
    setLoading(true);

    await Auth.register({
      name: values.name,
      email: values.email,
      password: values.password,
      document: values.document,
      supplierCategory: values.supplierCategory,
      isSupplier: values.isSupplier,
      address: values.address,
    })
      .then((res: any) => {
        if (res?.data?.user) {
          setItemToLocalStorage("user", res.data.user);
          return router.push("/dashboard");
        }

        setLoading(false);
        showToastify({
          label: "Impossível criar sua conta. Por favor, tente novamente.",
          type: "error",
        });
      })
      .catch((error) => {
        if (error?.response?.data?.code === 400) {
          showToastify({
            label:
              "Impossível criar sua conta pois já existe um e-mail cadastrado.",
            type: "error",
          });
        }

        showToastify({
          label: "Impossível criar sua conta. Por favor, tente novamente.",
          type: "error",
        });
        setLoading(false);
      });
  };

  const StepOne = (props: IStepOneProps) => {
    const handleSubmit = (values: Partial<IRegisterAccount>) => {
      props.next(values);
    };

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={FirstStepValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, handleSubmit }: FormikProps<IRegisterAccount>) => (
          <Form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <FormItem
              label="nome da empresa"
              errorMessage={errors.name}
              invalid={!!(errors.name && touched.name)}
            >
              <Field
                invalid={!!(errors.name && touched.name)}
                name="name"
                type="text"
                label="Name"
                component={Input}
              />
            </FormItem>
            <FormItem
              label="email"
              errorMessage={errors.email}
              invalid={!!(errors.email && touched.email)}
            >
              <Field
                invalid={!!(errors.email && touched.email)}
                name="email"
                type="email"
                label="Email"
                component={Input}
              />
            </FormItem>
            <FormItem
              label="CNPJ"
              errorMessage={errors.document}
              invalid={!!(errors.document && touched.document)}
            >
              <Field
                invalid={!!(errors.document && touched.document)}
                name="document"
                type="text"
                label="document"
                component={Input}
              />
            </FormItem>
            <FormItem
              label="categoria"
              errorMessage={errors.supplierCategory}
              invalid={!!(errors.supplierCategory && touched.supplierCategory)}
            >
              <Field
                invalid={
                  !!(errors.supplierCategory && touched.supplierCategory)
                }
                name="supplierCategory"
                component={Select}
              >
                <option value={undefined}>selecione uma categoria</option>
                {categories.map((categorie: ICategoryProps, index) => (
                  <option key={index} value={categorie.id}>
                    {categorie.title}
                  </option>
                ))}
              </Field>
            </FormItem>
            <FormItem
              label="senha"
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
            <ButtonPrimary
              type="submit"
              className="w-full mt-4"
              disabled={loading}
            >
              Avançar
            </ButtonPrimary>
          </Form>
        )}
      </Formik>
    );
  };
  const StepTwo: any = () => {
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={SecondStepValidationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ errors, touched, handleSubmit }: FormikProps<IRegisterAccount>) => (
          <Form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <FormItem
              errorMessage={errors.address?.zipcode}
              invalid={!!(errors.address?.zipcode && touched.address?.zipcode)}
              label="CEP"
            >
              <Field
                invalid={
                  !!(errors.address?.zipcode && touched.address?.zipcode)
                }
                name="address.zipcode"
                type="text"
                label="CEP"
                component={Input}
              />
            </FormItem>

            <FormItem
              label="endereço"
              errorMessage={errors.address?.street}
              invalid={!!(errors.address?.street && touched.address?.street)}
            >
              <Field
                invalid={!!(errors.address?.street && touched.address?.street)}
                name="address.street"
                type="text"
                label="street"
                component={Input}
              />
            </FormItem>

            <FormItem
              label="numero"
              errorMessage={errors.address?.number}
              invalid={!!(errors.address?.number && touched.address?.number)}
            >
              <Field
                invalid={!!(errors.address?.number && touched.address?.number)}
                name="address.number"
                type="text"
                label="number"
                component={Input}
              />
            </FormItem>
            <FormItem
              label="bairro"
              errorMessage={errors.address?.neighborhood}
              invalid={
                !!(
                  errors.address?.neighborhood && touched.address?.neighborhood
                )
              }
            >
              <Field
                invalid={
                  !!(
                    errors.address?.neighborhood &&
                    touched.address?.neighborhood
                  )
                }
                name="address.neighborhood"
                type="text"
                label="Bairro"
                component={Input}
              />
            </FormItem>
            <FormItem
              label="cidade"
              errorMessage={errors.address?.city}
              invalid={!!(errors.address?.city && touched.address?.city)}
            >
              <Field
                invalid={!!(errors.address?.city && touched.address?.city)}
                name="address.city"
                type="text"
                label="Cidade"
                component={Input}
              />
            </FormItem>
            <FormItem
              label="estado"
              errorMessage={errors.address?.state}
              invalid={!!(errors.address?.state && touched.address?.state)}
            >
              <Field
                invalid={!!(errors.address?.state && touched.address?.state)}
                name="address.state"
                type="text"
                label="Estado"
                component={Input}
              />
            </FormItem>
            <ButtonPrimary
              type="submit"
              className="w-full mt-4"
              disabled={loading}
            >
              Avançar
            </ButtonPrimary>
          </Form>
        )}
      </Formik>
    );
  };
  const steps = [
    <StepOne key={0} next={handleNextStep} data={initialValues} />,
    <StepTwo key={1} data={initialValues} />,
  ];
  return <div>{steps[currentStep]}</div>;
};

export default FormComponent;