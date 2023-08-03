import React from "react";
import Link from "next/link";
import FormComponent from "./FormComponent";

const SupplierRegisterPage = () => {
  return (
    <div className={`nc-PageSignUp `} data-nc-id="PageSignUp">
      <div className="container mb-24 lg:mb-32">
        <h2 className="my-20 flex items-center text-3xl leading-[115%] md:text-5xl md:leading-[115%] font-semibold text-black dark:text-neutral-100 justify-center">
          Criar Conta
        </h2>
        <div className="max-w-md mx-auto space-y-6 ">
          {/* FORM */}
          <FormComponent />
          {/* ==== */}
          <span className="block text-center text-black font-medium dark:text-neutral-300">
            voltar para { }
            <Link className="text-primary-ez2live font-semibold" href="/login">
              login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SupplierRegisterPage;