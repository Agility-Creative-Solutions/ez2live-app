import ButtonPrimary from "@/components/atoms/Button/ButtonPrimary";
import React from "react";
import I404Png from "@/images/404.png";
import NcImage from "@/components/atoms/NcImage";

const Page404 = () => (
  <div className="nc-Page404">
    <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-5">
      {/* HEADER */}
      <header className="text-center max-w-2xl mx-auto space-y-2">
        <NcImage src={I404Png} alt="not-found" />
        <span className="block text-sm text-neutral-800 sm:text-base tracking-wider font-medium">
          {`THE PAGE YOU WERE LOOKING FOR DOESN'T EXIST.`}{" "}
        </span>
        <div className="pt-8">
          <ButtonPrimary href="/">Return Home Page</ButtonPrimary>
        </div>
      </header>
    </div>
  </div>
);

export default Page404;
