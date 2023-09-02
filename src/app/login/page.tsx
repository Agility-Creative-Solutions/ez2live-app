import React from "react";

import Link from "next/link";
import FormComponent from "./FormComponent";
import SocialLoginComponent from "./SocialLoginComponent";

const PageLogin = () => {
  return (
    <div className={`nc-PageLogin`} data-nc-id="PageLogin">
      <div className="container mb-8 lg:mb-32">
        <div className="mt-8 mb-16 flex items-center justify-between">
          <h2 className=" pl-6 flex items-center text-2xl leading-[115%] md:text-5xl md:leading-[115%] font-bold text-black dark:text-neutral-100 justify-center">
            Entrar
          </h2>
          <div>
            <div className="relative rounded-full w-40 h-16 bg-gradient-to-r from-secondary-ez2live to-secondary-ez2livebg">
              <div className="absolute top-8 right-0 rounded-full w-16 h-16 bg-gradient-to-r from-secondary-ez2live to-secondary-ez2livebg"></div>
            </div>
          </div>
        </div>
        <div className="max-w-md mx-auto space-y-6">
          {/* FORM */}
          <FormComponent />
          <span className="block text-center text-sm text-black font-semibold dark:text-neutral-300">
            nova conta? {}
            <Link
              className="text-primary-ez2live font-semibold"
              href="/register/user"
            >
              criar conta
            </Link>
          </span>
          {/* OR */}
          <div className="relative text-center">
            <span className="relative z-10 justify-center flex font-semibold text-sm items-center w-full dark:text-neutral-400 dark:bg-neutral-900">
              <div className="bg-white h-0.5 w-full mr-4"></div>
              <p className="bg-primary-ez2livebg w-4 ">OU</p>
              <div className="bg-white h-0.5 w-full ml-4"></div>
            </span>
          </div>
          {/* SOCIAL */}
          <SocialLoginComponent />
          {/* ==== */}

          <span className=" block pt-6 text-center text-sm font-medium text-black dark:text-neutral-300">
            <div className="bg-white h-0.5 w-auto m-auto mb-4"></div>
            <p> tem um estabelecimento e quer se juntar a nós? </p>
            <Link
              className="text-primary-ez2live text-sm font-semibold"
              href="/register/supplier"
            >
              cadastre-se!
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageLogin;
