"use client";

import React from "react";
import { CouponGenerating } from "@/components/atoms/index";
const CouponGeneretingPage = () => {
  return (
    <div>
      <CouponGenerating
        title="Gerando cupom de desconto..."
        subTitle="esse processo pode levar alguns segundos!"
      />
    </div>
  );
};

export default CouponGeneretingPage;