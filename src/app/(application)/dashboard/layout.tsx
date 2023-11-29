import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const SupplierLayout = async ({ children }: { children: React.ReactNode }) => {
  const PublicRoutesRedirect = async () => {
    const session = await getServerSession(authOptions);

    if (session && session.user.role === "user") {
      return redirect("/");
    }
  };

  await PublicRoutesRedirect();

  return (
    <div className="user-layout">
      <div className="user-layout__container">{children}</div>
    </div>
  );
};

export default SupplierLayout;
