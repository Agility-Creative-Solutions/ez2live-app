"use client";
import React, { FC } from "react";
import Image from "next/image";
import LogoImage from "@/images/easytolive/logo/logotipo-semfundoazulroxo.svg";
import { AvatarDropdown, UserSubscriptionBadge } from "@/components";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { ROLES } from "@/constants/roles";
import { SUBSCRIPTION_STATUS } from "@/constants/payment";

interface NavBarLoggedProps {
  hasLogoImage?: boolean;
}

const NavBarLogged: FC<NavBarLoggedProps> = ({ hasLogoImage = true }) => {
  const { data: session } = useSession();
  const isNormalUser = session?.user.role === ROLES.commonUser;
  const hasPremium = !!session?.user.iuguSubscriptionId;
  const hasTrial =
    session?.user.subscriptionStatus === SUBSCRIPTION_STATUS.TRIAL;
  return (
    <div className="relative w-full p-2 flex pl-4  sm:justify-center items-center">
      <span></span>
      {hasLogoImage && (
        <Link href={session?.user.isSupplier ? "/app/dashboard" : "/app"}>
          <Image
            className="w-auto h-8 rounded-full cursor-pointer"
            src={session?.user?.image ?? LogoImage}
            alt="Logo Extentida"
          />
        </Link>
      )}
      <div className="flex absolute right-2 items-center gap-3">
        {isNormalUser && session.user.subscriptionStatus && (
          <UserSubscriptionBadge hasPremium={hasPremium} hasTrial={hasTrial} />
        )}
        <AvatarDropdown />
      </div>
    </div>
  );
};

export default NavBarLogged;
