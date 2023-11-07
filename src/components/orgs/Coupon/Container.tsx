"use client";

import React, { useEffect, useState } from "react";
import { StaticImageData } from "next/image";
import {
  Modal,
  Coupon,
  CouponActivatedPage,
  CreateAndUpdateCoupon,
} from "@/components/mols/index";
import { ButtonPrimary, ButtonThird } from "@/components/atoms/index";
import CouponGenerating from "@/components/atoms/CouponLoading";
import couponsService from "@/service/coupons.service";
import { showToastify } from "@/hooks/showToastify";
import { AxiosResponse } from "axios";
import CouponCard from "@/components/mols/CouponCard";
import { useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { ICoupon } from "@/types/coupons";

interface CouponContainerProps {
  supplierId: string;
  couponTitle: string;
  discount: string;
  maxUnitsTotal: number;
  expirateTime: string;
  expirationUseDate: string;
  CouponId: string;
  supplierLogo: string | StaticImageData;
  supplierCategory: string;
  supplierName: string;
  icon: string | StaticImageData;
  isOwnSupplier: boolean;
  handleCouponUpdate: (
    updatedCouponId: ICoupon,
    action: "CREATE" | "UPDATE" | "DELETE",
  ) => void;
}

const STEPS = {
  SHOWING_COUPON: 0,
  LOADING_COUPON: 1,
  COUPON_ACTIVE: 2,
  SHOWING_COUPON_CODE: 3,
  REDIRECT_TO_LOGIN: 4,
};

const CouponContainer: React.FC<CouponContainerProps> = ({
  supplierId,
  isOwnSupplier = false,
  discount,
  maxUnitsTotal,
  supplierLogo,
  expirateTime,
  expirationUseDate,
  supplierCategory,
  CouponId,
  supplierName,
  icon,
  couponTitle,
  handleCouponUpdate,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(STEPS.SHOWING_COUPON);
  const searchParams = useSearchParams();
  const couponIdParam = searchParams.get("coupon");
  const router = useRouter();
  const { data: session } = useSession();

  const handleNextStep = (step: number) => setCurrentStep(step);

  useEffect(() => {
    if (couponCode) {
      handleNextStep(STEPS.COUPON_ACTIVE);
    }
  }, [couponCode]);

  useEffect(() => {
    if (showCouponModal) {
      handleNextStep(STEPS.SHOWING_COUPON);
    }
  }, [showCouponModal]);

  useEffect(() => {
    if (currentStep === STEPS.COUPON_ACTIVE) {
      setTimeout(() => {
        handleNextStep(STEPS.SHOWING_COUPON_CODE);
      }, 1500);
    }
  }, [currentStep]);

  useEffect(() => {
    if (CouponId === couponIdParam) {
      setShowCouponModal(true);
    }
  }, [CouponId, couponIdParam]);

  const StepOne = () => {
    return (
      <div className="flex flex-col h-auto items-center">
        <Coupon
          id={CouponId}
          couponTitle={couponTitle}
          couponDiscount={discount}
          expirateTime={expirateTime}
          unintsAmount={maxUnitsTotal}
          supplierCategory={supplierCategory}
          supplierLogo={supplierLogo}
          supplierName={supplierName}
        />
        <ButtonPrimary
          onClick={() => handleActiveCoupon()}
          className="w-full mx-4 max-w-md"
        >
          Eu quero!
        </ButtonPrimary>
        <ButtonThird
          className="w-full mx-4 max-w-md"
          onClick={() => setShowCouponModal(false)}
        >
          não quero mais
        </ButtonThird>
      </div>
    );
  };

  const StepTwo = () => {
    return (
      <CouponGenerating
        title="Gerando cupom de desconto"
        subTitle="esse processo pode levar alguns segundos!"
        backGround="primary"
        couponAnimation={true}
        couponColor="secondary"
      />
    );
  };

  const StepThree = () => {
    return (
      <CouponGenerating
        title="Cupom ativo"
        subTitle="aproveite esse desconto incrível!"
        backGround="secondary"
        couponAnimation={false}
        couponColor="primary"
      />
    );
  };

  interface StepFour {
    couponCode: string;
  }

  const StepFour: React.FC<StepFour> = ({ couponCode }) => {
    return (
      <div className="flex flex-col h-auto items-center">
        <CouponActivatedPage
          couponTitle={couponTitle}
          couponDiscount={discount}
          expirateTime={expirationUseDate}
          couponActivateCode={couponCode}
          supplierCategory={supplierCategory}
          supplierLogo={supplierLogo}
          supplierName={supplierName}
        />
        <ButtonPrimary
          onClick={() => router.push("/my-coupons")}
          className="w-full mx-4 max-w-md"
        >
          Ok, entendi!
        </ButtonPrimary>
        <ButtonPrimary
          className="w-full mx-4 max-w-md !bg-white !text-primary-main !shadow-none"
          onClick={() => setShowCouponModal(false)}
        >
          voltar
        </ButtonPrimary>
      </div>
    );
  };

  const StepRedirectToLogin = () => {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-center p-2">
          Cadastre-se agora e ganhe 14 dias de acesso ao premium gratuitamente!
          <br />
          Venha desfrutar os benefícios exclusivos.
        </h2>

        <p className="text-xs text-center">
          {"(não é necessário cadastrar cartão de crédito)"}
        </p>
        <ButtonPrimary
          onClick={() =>
            signIn(undefined, {
              callbackUrl: `/supplier-dashboard/${supplierId}/?coupon=${CouponId}`,
            })
          }
        >
          {" "}
          Junte-se a nós!
        </ButtonPrimary>
        <ButtonThird onClick={() => setShowCouponModal(false)}>
          cancelar
        </ButtonThird>
      </div>
    );
  };

  const renderStep = (step: number) => {
    switch (step) {
      case STEPS.SHOWING_COUPON:
        return <StepOne />;
      case STEPS.LOADING_COUPON:
        return <StepTwo />;
      case STEPS.COUPON_ACTIVE:
        return <StepThree />;
      case STEPS.SHOWING_COUPON_CODE:
        return <StepFour couponCode={couponCode} />;
      case STEPS.REDIRECT_TO_LOGIN:
        return <StepRedirectToLogin />;
      default:
        return <StepOne />;
    }
  };

  const activateCoupon = async () => {
    const res: AxiosResponse =
      await couponsService.generateCouponCode(CouponId);
    return res;
  };

  const handleActiveCoupon = async () => {
    if (session?.user) {
      handleNextStep(STEPS.LOADING_COUPON);

      activateCoupon()
        .then((res) => {
          if (res?.data?.coupon?.code) {
            return setTimeout(() => {
              setCouponCode(res?.data?.coupon?.code);
            }, 2500);
          }

          setCurrentStep(STEPS.SHOWING_COUPON);
          showToastify({
            label: "Ocorreu um erro interno. Por favor, tente novamente.",
            type: "error",
          });
        })
        .catch((error) => {
          setCurrentStep(STEPS.SHOWING_COUPON);
          if (error?.response?.data?.code === 400) {
            showToastify({
              label:
                "O Coupon que está tentando ativar não é mais válido, atualize a página.",
              type: "error",
            });
          }
          if (error?.response?.data?.code === 500) {
            showToastify({
              label: "Ocorreu um erro interno. Por favor, tente novamente.",
              type: "error",
            });
          }
          if (error?.response?.data?.code === 404) {
            showToastify({
              label: "Nenhum dado encontrado. Por favor, tente novamente.",
              type: "error",
            });
          }
        });
    } else {
      showToastify({
        label: "É necessário estar logado para gerar código de cupom",
        type: "warning",
      });
      handleNextStep(STEPS.REDIRECT_TO_LOGIN);
    }
  };

  return (
    <div>
      {showCouponModal && (
        <Modal
          show={showCouponModal}
          closeOnBlur={true}
          onCloseModal={() => setShowCouponModal(false)}
        >
          {isOwnSupplier ? (
            <CreateAndUpdateCoupon
              isUpdatingCoupon={true}
              couponId={CouponId}
              handleCouponUpdate={handleCouponUpdate}
            />
          ) : (
            renderStep(currentStep)
          )}
        </Modal>
      )}

      <CouponCard
        couponTitle={couponTitle}
        discount={discount}
        maxUnitsTotal={maxUnitsTotal}
        expirationUseDate={expirateTime}
        setShowCouponModal={setShowCouponModal}
        icon={icon}
      />
    </div>
  );
};

export default CouponContainer;
