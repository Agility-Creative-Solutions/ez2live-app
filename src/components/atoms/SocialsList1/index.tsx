import { SocialType } from "@/components/atoms/SocialsShare";
import React, { FC } from "react";
// import facebook from "@/images/socials/facebook.svg";
// import twitter from "@/images/socials/twitter.svg";
// import telegram from "@/images/socials/telegram.svg";
// import youtube from "@/images/socials/youtube.svg";
import instagram from "@/images/socials/instagram.svg";
import Image from "next/image";

export interface SocialsList1Props {
  className?: string;
}

const socials: SocialType[] = [
  {
    name: "Instagram",
    icon: instagram,
    href: "https://www.instagram.com/easytoliv/",
  },
  // { name: "Facebook", icon: facebook, href: "#" },
  // { name: "Youtube", icon: youtube, href: "#" },
  // { name: "Telegram", icon: telegram, href: "#" },
  // { name: "Twitter", icon: twitter, href: "#" },
];

const SocialsList1: FC<SocialsList1Props> = ({ className = "space-y-3" }) => {
  const renderItem = (item: SocialType, index: number) => {
    return (
      <a
        href={item.href}
        className="flex items-center text-white text-2xl hover:text-primary-main leading-none space-x-2 group"
        key={index}
      >
        <div className="flex-shrink-0 w-5 ">
          <Image sizes="40px" src={item.icon} alt="" />
        </div>
        <span className="hidden lg:block text-sm">{item.name}</span>
      </a>
    );
  };

  return (
    <div className={`nc-SocialsList1 ${className}`} data-nc-id="SocialsList1">
      {socials.map(renderItem)}
    </div>
  );
};

export default SocialsList1;
