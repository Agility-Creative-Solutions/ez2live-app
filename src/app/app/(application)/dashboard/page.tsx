"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import CheckIcon from "@/images/easytolive/icons/checkIcon.svg";
import CouponPrimary from "@/images/easytolive/icons/couponPrimary.svg";
import DashboardIcon from "@/images/easytolive/icons/dashboardIcon.svg";
import ShopPageIcon from "@/images/easytolive/icons/shopMainColor.svg";
import CalendarCheckIcon from "@/images/easytolive/icons/calendarCheck.svg";
import LogoImage from "@/images/easytolive/logo/logotipo-fundoazulroxo.svg";

import classNames from "@/utils/classNames";
import supplierService from "@/service/supplier.service";
import { showToastify } from "@/hooks/showToastify";
import { LoadingComponent } from "@/components";

interface IDashboardData {
  couponsGenerated: number;
  couponsActivated: number;
  couponsAvailable: number;
  couponsFinished: number;
}

interface IDashboardItems {
  icon?: string;
  title?: string;
  subtitle?: string;
}

const PageDashboard = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dashboardData, setDashboardData] = useState<IDashboardItems[]>();

  const getSupplierData = async (supplierId: string) =>
    await supplierService.getSupplierDashboardData(supplierId);

  const handleDashboarData = (data: IDashboardData) => {
    const {
      couponsGenerated,
      couponsActivated,
      couponsAvailable,
      couponsFinished,
    } = data;
    setDashboardData([
      {
        icon: CouponPrimary,
        title: couponsGenerated.toString(),
        subtitle: "Cupons gerados no total",
      },
      {
        icon: CheckIcon,
        title: couponsActivated.toString(),
        subtitle: "Cupons ativos no total",
      },
      {
        icon: CalendarCheckIcon,
        title: couponsAvailable.toString(),
        subtitle: "Ofertas disponíveis",
      },
      {
        icon: CouponPrimary,
        title: couponsFinished.toString(),
        subtitle: "Ofertas concluídas",
      },
    ]);
  };

  useEffect(() => {
    if (!session?.user) return;

    getSupplierData(session?.user?.id)
      .then((res: any) => handleDashboarData(res.data))
      .catch((error) =>
        showToastify({ type: "error", label: `Ocorreu um erro: ${error}` }),
      )
      .finally(() => setIsLoading(false));
  }, [session?.user]);

  const supplierBanner = session?.user?.supplierInfo?.supplierBanner
    ? `url(${session?.user?.supplierInfo?.supplierBanner})`
    : "";

  return (
    <div className="relative overflow-hidden flex gap-3 p-5 max-w-screen-2xl mx-auto flex-col sm:flex-row">
      <div className="md:flex flex-col sm:w-[300px] w-full pb-5 mb-3 sm:mb-0 border-b border-gray-100 sm:border-none">
        <div className="flex flex-col w-full gap-5 rounded-lg bg-[#e7eaf133] px-2">
          <div className="flex flex-col w-full h-24 gap-5 relative">
            <div
              className={classNames(!supplierBanner && "bg-primary-main")}
              style={{
                backgroundImage: supplierBanner,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100%",
                height: "100%",
                filter: "contrast(0.5) blur(1px)",
              }}
            />
            <div className="absolute left-0 top-0 h-full flex items-center justify-center">
              <div className="flex flex-row justify-center items-center">
                <div className="flex flex-row w-full h-full gap-1 justify-center items-center ml-2">
                  <div className="rounded-full bg-gray-200">
                    <Image
                      src={
                        session?.user?.supplierInfo?.supplierLogo || LogoImage
                      }
                      alt="logo"
                      className="rounded-full"
                      width={50}
                      height={50}
                    />
                  </div>
                  <div className="flex flex-col">
                    {session?.user?.name && (
                      <p className="text-lg font-semibold text-white">
                        {session?.user?.name}
                      </p>
                    )}
                    {session?.user?.email && (
                      <p className="text-xs text-white">
                        {session?.user?.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* validate coupon */}
          <div className="">
            <div className="w-full flex flex-col relative mb-2 justify-center gap-2">
              {[
                {
                  href: "/app/dashboard",
                  label: "Dashboard",
                  icon: DashboardIcon,
                },
                {
                  href: "/app/dashboard/parceiro/ativar-cupom",
                  label: "Ativar cupom",
                  icon: CheckIcon,
                },
                {
                  href: "/app/dashboard/parceiro/perfil",
                  label: "Criar novo cupom",
                  icon: CouponPrimary,
                },
                {
                  href: "/app/dashboard/parceiro/perfil",
                  label: "Meu perfil",
                  icon: ShopPageIcon,
                },
              ].map(({ href, label, icon }, idx) => (
                <a
                  key={idx}
                  href={href}
                  className={classNames(
                    "w-full py-2 px-3 hover:bg-secondary-main font-semibold text-xs md:text-sm flex flex-row gap-3 text-primary-main rounded-md transition",
                    pathname === href ? "bg-secondary-main" : "bg-transparent",
                  )}
                >
                  <Image src={icon} width={20} alt="icon" className="flex" />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full px-5">
        <h2 className="text-xl font-semibold mb-7">Dashboard</h2>
        <div className="grid lg:grid-cols-4 justify-center gap-10 b9r grid-cols-1 sm:grid-cols-2">
          {isLoading && <LoadingComponent fullSize />}
          {/* cards */}
          {dashboardData &&
            dashboardData.map(({ icon, title, subtitle }, idx) => (
              <div
                className={classNames(
                  "md:w-full p-4 py-3 w-full border-l-8 border-secondary-main bg-[#e7eaf122] rounded-lg shadow-sm flex flex-col",
                )}
                key={idx}
              >
                <div className="rounded-lg bg-[#6722ff0d] p-1 w-fit mb-3">
                  {icon && (
                    <Image src={icon} className="w-auto h-6" alt="card icon" />
                  )}
                </div>
                <h3 className="font-bold text-xl pl-2">{title}</h3>
                <p className="text-sm pl-2 text-gray-700">{subtitle}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PageDashboard;
