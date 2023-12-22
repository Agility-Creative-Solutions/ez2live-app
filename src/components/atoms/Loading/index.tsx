"use client";

import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import cx from "classnames";

interface ILoadingComponent {
  fullSize?: boolean;
  bgStyle?: "main" | "secondary" | "none";
  Icon?: StaticImageData;
}

const LoadingComponent: React.FC<ILoadingComponent> = ({
  fullSize = true,
  bgStyle = "main",
  Icon,
}) => {
  const COLORS = {
    main: "bg-primary-main",
    secondary: "bg-secondary-main",
    none: "bg-none",
  };

  return (
    <div
      className={cx(
        bgStyle as keyof typeof COLORS,
        fullSize ? "min-h-[93vh]" : "",
        "flex flex-col items-center justify-around",
      )}
    >
      <span></span>
      <div className="relative">
        <motion.div
          className={cx(
            fullSize ? "w-40 h-40" : "w-10 h-10",
            "relative border-opacity-60 border-collapse pb-primary-main  rounded-full border-b-primary-main border-4 border-neutral-200 opacity-50 ",
          )}
          animate={{
            rotate: 360,
          }}
          transition={{ duration: 1, repeat: Infinity }}
        ></motion.div>
        {Icon && (
          <Image
            className="w-24 rounded-full h-auto absolute left-8 top-8"
            src={Icon}
            alt="logo-branca"
          />
        )}
      </div>
      <span></span>
    </div>
  );
};

export default LoadingComponent;
