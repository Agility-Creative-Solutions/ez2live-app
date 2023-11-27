"use client";

import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { ISupplierCompleteRegister } from "@/types/supplier";
import { ItemTypeImage, TextArea, ButtonPrimary, FormItem } from "@/components";

const CompleteSupplierRegister: React.FC = () => {
  const [loading, setloading] = useState(true);
  const [logoPlaceHolder, setLogoPlaceHolder] = useState("...carregar");
  const [ilustrationImagePlaceHolder, SetIlustrationImagePlaceHolder] =
    useState("...carregar");

  const CompleteSupplierRegisterSchema = Yup.object().shape({
    logo: Yup.mixed()
      .nullable()
      .required("Insira uma logo para seu estabelecimento")
      .test(
        "FILE_SIZE",
        "Arquivo muito grande! Selecione um de menor tramanho",
        (value: any) => !value || (value && value.size <= 1024 * 1024),
      )
      .test(
        "FILE_FORMAT",
        "Arquivo com formato não suportado",
        (value: any) =>
          !value || (value && ["image/png", "image/jpeg"].includes(value.type)),
      ),
    ilustration_image: Yup.mixed()
      .nullable()
      .required("Insira uma logo para seu estabelecimento")
      .test(
        "FILE_SIZE",
        "Arquivo muito grande! Selecione um de menor tramanho",
        (value: any) => !value || (value && value.size <= 1024 * 1024),
      )
      .test(
        "FILE_FORMAT",
        "Arquivo com formato não suportado",
        (value: any) =>
          !value || (value && ["image/png", "image/jpeg"].includes(value.type)),
      ),
    description: Yup.string().required(
      "escolha uma descrição para seu estabelecimento",
    ),
  });

  const handleFormSubmit = async (values: ISupplierCompleteRegister) => {
    setloading(true);
    //TO DO -- Criar endpoint para enviar as imagens de logo e ilustração do supplier
    return values;
  };

  return (
    <div>
      <div className="mt-8 mb-16 w-full gap-4 flex items-center justify-between">
        <h2 className=" pl-6 flex items-center text-lg leading-[115%] md:text-3xl md:leading-[115%] font-bold text-black dark:text-neutral-100 justify-center">
          Completar <br /> cadastro
        </h2>
        <div>
          <div className="relative rounded-full w-40 h-16 bg-gradient-to-r from-secondary-main to-secondary-lighter">
            <div className="absolute top-8 right-0 rounded-full w-16 h-16 bg-gradient-to-r from-secondary-main to-secondary-lighter"></div>
          </div>
        </div>
      </div>

      <Formik
        initialValues={{
          logo: "",
          ilustration_image: "",
          description: "",
        }}
        validationSchema={CompleteSupplierRegisterSchema}
        onSubmit={handleFormSubmit}
      >
        {({ errors, touched, handleSubmit, setFieldValue }) => (
          <Form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <FormItem
              label="Logo"
              errorMessage={errors.logo}
              invalid={!!(errors.logo && touched.logo)}
            >
              <label
                onChange={() => setLogoPlaceHolder("carregado")}
                htmlFor="logo"
                className="flex justify-between cursor-pointer focus:border-primary-main items-center w-full border-black border-[1px] rounded-3xl h-11 px-4 py-3 text-sm font-medium"
              >
                <p>{logoPlaceHolder}</p>
                <span>
                  <ItemTypeImage className="w-8 h-8 bg-white" />
                </span>
                <input
                  className="hidden"
                  id="logo"
                  type="file"
                  onChange={(event: any) =>
                    setFieldValue("logo", event.target.files[0])
                  }
                />
              </label>
            </FormItem>

            <FormItem
              label="Imagem ilustrativa"
              errorMessage={errors.ilustration_image}
              invalid={
                !!(errors.ilustration_image && touched.ilustration_image)
              }
            >
              <label
                onChange={() => SetIlustrationImagePlaceHolder("carregado")}
                htmlFor="ilustration_image"
                className="flex justify-between cursor-pointer focus:border-primary-main items-center w-full border-black border-[1px] rounded-3xl h-11 px-4 py-3 text-sm font-medium"
              >
                <p>{ilustrationImagePlaceHolder}</p>
                <span>
                  <ItemTypeImage className="w-8 h-8 bg-white" />
                </span>
                <input
                  className="hidden"
                  id="ilustration_image"
                  type="file"
                  onChange={(event: any) =>
                    setFieldValue("ilustration_image", event.target.files[0])
                  }
                />
              </label>
            </FormItem>

            <FormItem
              label="descrição"
              errorMessage={errors.description}
              invalid={!!(errors.description && touched.description)}
            >
              <Field
                name="description"
                label="description"
                component={TextArea}
                className="h-32 bg-white text-black"
                placeholder="escrever descrição do estabelecimento"
              />
            </FormItem>

            <ButtonPrimary
              type="submit"
              className="w-full mt-6"
              disabled={loading}
              loading={loading}
            >
              Completar cadastro
            </ButtonPrimary>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CompleteSupplierRegister;