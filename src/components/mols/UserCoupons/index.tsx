"use client";

import React, { useState } from "react";
import { StaticImageData } from "next/image";
import CouponRed from "@/images/easytolive/icons/couponred.svg";
import CouponGreen from "@/images/easytolive/icons/coupongreen.svg";
import { Modal, CouponActivated } from "@/components";
import CouponCard from "../CouponCard";
import Arrow from "@/images/easytolive/icons/arrow-next-right-primary.svg";
import { ICouponCodesByUser } from "@/types/coupons";
import { getRemainingUnitsAmount } from "@/utils/getCouponsRemaining";

interface UserCouponsProps {
  couponCodeData: ICouponCodesByUser;
  icon: string | StaticImageData;
}

type PropsByStatus = {
  [key: string]: {
    couponTitle: string;
    activationDate?: string;
    expirationUseDate?: string;
    discount?: string;
    remainingUnits?: number;
    mainImage?: string | StaticImageData;
  };
};

const UserCoupons: React.FC<UserCouponsProps> = ({ couponCodeData }) => {
  const [showCouponModal, setShowCouponModal] = useState(false);

  const {
    activationDate,
    coupon,
    code: couponActivateCode,
    status,
  } = couponCodeData;

  const { title: couponTitle, expirationUseDate, discount, supplier } = coupon;

  const {
    name: supplierName,
    whatsappPhoneNumber: phoneNumber,
    supplierInfo: { supplierCategory },
  } = supplier;

  const propsByStatus: PropsByStatus = {
    USED: {
      couponTitle,
      activationDate,
      mainImage: CouponGreen,
    },
    EXPIRED: {
      couponTitle,
      expirationUseDate,
      mainImage: CouponRed,
    },
    ACTIVE: {
      couponTitle,
      remainingUnits: getRemainingUnitsAmount(coupon),
      expirationUseDate,
    },
  };

  return (
    <div>
      {showCouponModal && status === "ACTIVE" && (
        <Modal
          show={showCouponModal}
          closeOnBlur={true}
          onCloseModal={() => setShowCouponModal(false)}
        >
          {supplierName && supplierCategory && (
            <CouponActivated
              supplierPhoneNumber={phoneNumber}
              couponActivateCode={couponActivateCode}
              couponDiscount={discount}
              couponTitle={couponTitle}
              expirateTime={expirationUseDate}
              supplierCategory={supplierCategory.title}
              supplierLogo={
                coupon.supplier.supplierInfo.supplierLogo || "no-image"
              }
              supplierName={supplierName}
            />
          )}
        </Modal>
      )}

      <CouponCard
        icon={Arrow}
        discount={discount}
        setShowCouponModal={setShowCouponModal}
        {...propsByStatus[status]}
      />
    </div>
  );
};

export default UserCoupons;
