import React from "react";
import Image, { StaticImageData } from "next/image";
import CouponGreen from "@/images/easytolive/icons/coupongreen.svg";
import ClockCircleRed from "@/images/easytolive/icons/clock_circleRed.svg";
import { AccordionInfo } from "@/components";
import { getDateFormater } from "@/utils/getDateFormater";
import { getColorByDiscountValue } from "@/utils/getColorByDiscountValue";
import getExpirateTime from "@/utils/getExpirateTime";
import cx from "classnames";
import { getCouponsRemaining } from "@/utils/getCouponsRemaining";
interface CouponProps {
  isOwnSupplier: boolean;
  id: string;
  couponTitle: string;
  remainingUnits?: number;
  expirateTime: string;
  supplierLogo: string | StaticImageData;
  supplierName: string;
  couponDiscount: string;
  supplierCategory: string;
  couponRules: string;
}

const CouponContent: React.FC<CouponProps> = ({
  isOwnSupplier,
  remainingUnits,
  couponDiscount,
  expirateTime,
  supplierLogo,
  supplierName,
  couponTitle,
  couponRules,
}) => {
  return (
    <div className="flex flex-col px-2 w-full pb-3 text-black">
      <h1 className=" text-2xl px-3 mb-2 font-bold text-black">
        {couponTitle}
      </h1>
      <div className="flex mb-4 gap-4 justify-between items-center">
        <div className="flex flex-col gap-1.5 text-sm">
          <p className="flex font-semibold items-center text-generic-alertGreen">
            <Image
              className="h-5 pr-2 w-auto"
              alt="coupon-green"
              src={CouponGreen}
              color="white"
            />
            {remainingUnits &&
              getCouponsRemaining(remainingUnits, isOwnSupplier)}
          </p>
          <p className="flex font-semibold items-center text-generic-alertRed">
            <Image
              className="h-4 pr-2 w-auto"
              alt="coupon-black"
              src={ClockCircleRed}
            />
            {getExpirateTime(expirateTime)}
          </p>
        </div>
        <span
          className={cx(
            getColorByDiscountValue(couponDiscount),
            "relative text-3xl font-medium w-32 h-16 text-white flex items-center justify-center px-6 rounded-full",
          )}
        >
          {couponDiscount}%
        </span>
      </div>
      <hr className="border-neutral-100 border-[1.5px] mb-4"></hr>
      <div className="flex flex-col m-1 h-auto">
        <div className="flex gap-3 item-center mb-3">
          <Image
            width={56}
            height={56}
            className="w-14 h-14 rounded-full"
            src={supplierLogo}
            alt="supplier-logo"
          />
          <div className="my-auto font-semibold">
            <p className=" text-lg">{supplierName}</p>
          </div>
        </div>
        <p className="items-center mb-4 p-3">
          Validade: {getDateFormater(expirateTime)}
        </p>
        {couponRules && (
          <AccordionInfo
            data={[
              {
                name: "Regras de uso",
                content: `${couponRules}`,
              },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default CouponContent;
