"use client";

import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { ISupplierCompleteRegister } from "@/types/supplier";
import {
  ItemTypeImage,
  TextArea,
  ButtonPrimary,
  FormItem,
  Modal,
} from "@/components";
import supplierService from "@/service/supplier.service";
import { useSession } from "next-auth/react";
import { showToastify } from "@/hooks/showToastify";
import ImageSizeWarning from "@/components/atoms/ImageSizeWarning";
import { useCompleteSupplierRegister } from "./Context";

const CompleteSupplierRegister: React.FC = () => {
  const { data: session, update } = useSession();
  const [loading, setloading] = useState(false);
  const [logoPlaceHolder, setLogoPlaceHolder] = useState("Escolher imagem...");
  const [ilustrationImagePlaceHolder, SetIlustrationImagePlaceHolder] =
    useState("Escolher imagem...");

  const { isUpdate, setUpdate } = useCompleteSupplierRegister();

  const CompleteSupplierRegisterSchema = Yup.object().shape({
    supplierLogo: Yup.mixed()
      .when([], (value: any, schema: any) => {
        if (!isUpdate) {
          return schema.required("Insira um logo para seu estabelecimento");
        }
        return schema.nullable();
      })
      .test(
        "FILE_SIZE",
        "Arquivo muito grande! Você pode enviar arquivos de até 1MB",
        (value: any) => !value || (value && value.size <= 1024 * 1024),
      )
      .test(
        "FILE_FORMAT",
        "Arquivo com formato não suportado",
        (value: any) =>
          !value || (value && ["image/png", "image/jpeg"].includes(value.type)),
      ),
    supplierBanner: Yup.mixed()
      .when([], (value: any, schema: any) => {
        if (!isUpdate) {
          return schema.required("Insira um banner para seu estabelecimento");
        }
        return schema.nullable();
      })
      .test(
        "FILE_SIZE",
        "Arquivo muito grande! Você pode enviar arquivos de até 1MB",
        (value: any) => !value || (value && value.size <= 1024 * 1024),
      )
      .test(
        "FILE_FORMAT",
        "Arquivo com formato não suportado",
        (value: any) =>
          !value || (value && ["image/png", "image/jpeg"].includes(value.type)),
      ),
  });

  const handleFormSubmit = async (values: ISupplierCompleteRegister) => {
    setloading(true);

    if (!session?.user) {
      return showToastify({
        type: "error",
        label: "Você precisa estar logado para completar o cadastro",
      });
    }

    let newSupplierInfo = {};

    const uploadedImages: any = await supplierService
      .updateSupplierImages(session?.user.id, {
        supplierLogo: values.supplierLogo,
        supplierBanner: values.supplierBanner,
        description: values.description,
      })
      .then((response) => response.data)
      .catch((error) => {
        console.log(error.response);
        if (error.response.data.code === 400) {
          showToastify({
            type: "success",
            label: "Perfil atualizado com sucesso!",
          });
        } else {
          showToastify({
            type: "error",
            label:
              "Tivemos um problema ao atualizar as imagens do estabelecimento",
          });
        }
      })
      .finally(() => {
        setloading(false);
        setUpdate(false);
      });

    if (uploadedImages) {
      newSupplierInfo = {
        supplierBanner: uploadedImages?.supplier?.supplierInfo.supplierBanner,
        supplierLogo: uploadedImages?.supplier?.supplierInfo.supplierLogo,
      };

      await supplierService
        .updateSupplierById(session?.user.id, {
          supplierInfo: {
            supplierDescription: values.description,
          },
        })
        .then((res: any) => {
          newSupplierInfo = {
            ...newSupplierInfo,
            supplierDescription:
              res.data.supplier.supplierInfo.supplierDescription,
          };

          showToastify({
            type: "success",
            label: "Cadastro completo com sucesso",
          });
        })
        .catch(() => {
          showToastify({
            type: "error",
            label: "Tivemos um problema ao completar seu cadastro",
          });
        })
        .finally(() => {
          setloading(false);
        });
    }

    update({
      ...session,
      user: {
        ...session?.user,
        supplierInfo: {
          ...session?.user.supplierInfo,
          ...newSupplierInfo,
        },
      },
    });

    return uploadedImages;
  };

  return (
    <Modal
      contentExtraClass="max-w-lg"
      closeOnBlur={false}
      hasCloseButton={isUpdate ? true : false}
      show={!!(session?.user && session.user.isSupplier)}
      onCloseModal={() => setUpdate(false)}
    >
      <div>
        <div className="mt-3 mb-5 w-full gap-4 flex items-center justify-between">
          <h2 className="pl-2 flex items-center text-lg leading-[115%] md:text-3xl md:leading-[115%] font-bold text-black dark:text-neutral-100 justify-center">
            {isUpdate ? "Atualizar" : "Completar"}
            <br /> cadastro
          </h2>
        </div>

        <Formik
          initialValues={{
            supplierLogo: "",
            supplierBanner: "",
            description: session?.user.supplierInfo?.supplierDescription || "",
          }}
          validationSchema={CompleteSupplierRegisterSchema}
          onSubmit={handleFormSubmit}
        >
          {({ errors, touched, handleSubmit, setFieldValue }) => (
            <Form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <FormItem
                label="Logomarca"
                errorMessage={errors.supplierLogo}
                invalid={!!(errors.supplierLogo && touched.supplierLogo)}
              >
                <div className="py-2">
                  <ImageSizeWarning
                    recommendedWidth={300}
                    recommendedHeight={300}
                  />
                </div>
                <label
                  onChange={() => setLogoPlaceHolder("Arquivo carregado")}
                  htmlFor="supplierLogo"
                  className="flex justify-between cursor-pointer focus:border-primary-main items-center w-full border-black border-[1px] rounded-3xl h-11 px-4 py-3 text-sm font-medium"
                >
                  <p>{logoPlaceHolder}</p>
                  <span>
                    <ItemTypeImage className="w-8 h-8 bg-white" />
                  </span>
                  <input
                    className="hidden"
                    id="supplierLogo"
                    type="file"
                    onChange={(event: any) =>
                      setFieldValue("supplierLogo", event.target.files[0])
                    }
                  />
                </label>
              </FormItem>

              <FormItem
                label="Banner"
                errorMessage={errors.supplierBanner}
                invalid={!!(errors.supplierBanner && touched.supplierBanner)}
              >
                <div className="py-3">
                  <ImageSizeWarning
                    recommendedWidth={1024}
                    recommendedHeight={300}
                  />
                </div>
                <label
                  onChange={() =>
                    SetIlustrationImagePlaceHolder("Arquivo carregado")
                  }
                  htmlFor="supplierBanner"
                  className="flex justify-between cursor-pointer focus:border-primary-main items-center w-full border-black border-[1px] rounded-3xl h-11 px-4 py-3 text-sm font-medium"
                >
                  <p>{ilustrationImagePlaceHolder}</p>
                  <span>
                    <ItemTypeImage className="w-8 h-8 bg-white" />
                  </span>
                  <input
                    className="hidden"
                    id="supplierBanner"
                    type="file"
                    onChange={(event: any) =>
                      setFieldValue("supplierBanner", event.target.files[0])
                    }
                  />
                </label>
              </FormItem>
              <FormItem
                label="Descrição"
                errorMessage={errors.description}
                invalid={!!(errors.description && touched.description)}
              >
                <Field
                  name="description"
                  label="description"
                  component={TextArea}
                  className="h-24 bg-white text-black"
                  placeholder="Uma breve descrição do estabelecimento"
                />
              </FormItem>
              <ButtonPrimary
                type="submit"
                className="w-full mt-2"
                disabled={loading}
                loading={loading}
              >
                {isUpdate ? "Atualizar" : "Completar"} cadastro
              </ButtonPrimary>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default CompleteSupplierRegister;
