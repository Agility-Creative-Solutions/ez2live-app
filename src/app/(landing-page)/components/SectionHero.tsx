import React, { FC } from "react";
import { ButtonFourth } from "@/components";
export interface SectionHero3Props {
  className?: string;
}

const SectionHero3: FC<SectionHero3Props> = ({ className = "" }) => {
  return (
    <div
      className={`relative ${className} container`}
      data-nc-id="SectionHero3"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 mt-44 space-y-5">
        {/* 1st column */}
        <div className="flex flex-col md:items-start items-center space-y-5 pt-24">
          <h2 className="font-bold text-white text-3xl text-center md:text-left md:text-4xl !leading-[115%]">
            Viver e praticar uma
            <span className="text-primary-main"> vida saudável </span> <br />
            nunca foi tão
            <span className="text-primary-main"> fácil e barato.</span>
          </h2>
          <p className="text-white max-w-md">
            Cadastre-se para acessar os maiores descontos das melhores lojas a
            um clique de distância!
          </p>
          <div className="m-auto">
            <ButtonFourth href="/app/conta/acessar" className="text-slate-2">
              GARANTIR ACESSO
            </ButtonFourth>
          </div>
        </div>

        {/* 2nd column */}
        <div className="border-2 border-primary-main rounded-3xl w-full h-96 flex items-center justify-center text-white">
          IMAGE
        </div>
      </div>
    </div>
  );
};

export default SectionHero3;
