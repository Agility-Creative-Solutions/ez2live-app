"use client";

import React, { useState } from "react";
import Image, { StaticImageData } from "next/image";
import { LoadingComponent } from "@/components/atoms";
interface IEmptyCoupons {
  icon: StaticImageData;
  title?: string;
  label?: string | false;
  href?: string | false;
}

interface IRedirectLink {
  href: string;
  label: string;
}

const RedirectLink: React.FC<IRedirectLink> = ({ href, label }) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <a
      onClick={() => setIsLoading(true)}
      className=" font-semibold cursor-pointer text-primary-main"
      href={href || ""}
    >
      {isLoading && <LoadingComponent fullSize={false} bgStyle="none" />}
      {label && !isLoading && <span>{label}</span>}
    </a>
  );
};

const EmptyCoupons: React.FC<IEmptyCoupons> = ({
  icon,
  title,
  label,
  href,
}) => {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <Image
        className="w-24 m-2 bg-white p-4 h-auto"
        src={icon}
        alt="Imagem Cupom"
      />
      {title && <h3 className="text-center text-lg font-semibold mb-10">{title}</h3>}
      {label && (
        <>
          {href ? (
            <RedirectLink href={href} label={label} />
          ) : (
            <p className=" font-semibold text-primary-main">{label}</p>
          )}
        </>
      )}
    </div>
  );
};

export default EmptyCoupons;
