"use client";

import { Popover, Transition } from "@/app/headlessui";
import userImage from "@/images/easytolive/user/user_circle_1.svg";
import React, { Fragment, useState } from "react";
import { Avatar, LoadingComponent } from "@/components";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import UserRoles from "@/hooks/useUserRoles";
import { Route } from "next";

const AvatarDropdown = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [isLoading, setIsLoading] = useState(false);

  const loginRedirectURL = UserRoles().isSupplier()
    ? "/app/dashboard"
    : "/app/meus-cupons";

  const textMyCouponsOrMyShop = UserRoles().isSupplier()
    ? "Dashboard"
    : "Meus Cupons";

  async function handleLogout() {
    setIsLoading(true);
    return await signOut({ redirect: true, callbackUrl: "/app/conta/entrar" });
  }

  return (
    <div className="AvatarDropdown ">
      <Popover className="relative">
        {({ close }) => (
          <>
            <Popover.Button
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full hover:bg-slate-100 focus:outline-none flex items-center justify-center`}
            >
              {isLoading ? (
                <span className="relative flex items-center">
                  <LoadingComponent
                    fullSize={false}
                    bgStyle="none"
                    size="small"
                  />
                </span>
              ) : (
                <Avatar imgUrl={user?.image ?? userImage} />
              )}
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute z-10 w-screen max-w-[260px] px-1 mt-3.5 right-0 sm:px-0">
                <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative grid grid-cols-1 gap-6 bg-white dark:bg-neutral-800 py-7 px-6">
                    <div className="flex items-center space-x-3">
                      <Avatar
                        imgUrl={user?.image ?? userImage}
                        sizeClass="w-8 h-8"
                      />

                      <div className="flex-grow">
                        <h4 className="font-semibold">
                          {user?.name ?? "Usuário desconhecido"}
                        </h4>
                      </div>
                    </div>

                    <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />

                    {/* ------------------ 1 --------------------- */}
                    <Link
                      href={"/app/minha-conta"}
                      className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100  focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      onClick={() => close()}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 ">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
                            stroke="black"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
                            stroke="black"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium ">Minha Conta</p>
                      </div>
                    </Link>
                    {/* ------------------ admin dashboard ----------------- */}
                    {UserRoles().isAdmin() && (
                      <Link
                        href={"/app/admin"}
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      >
                        <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g>
                              <path fill="none" d="M0 0h24v24H0z" />
                              <path d="M12 14v2a6 6 0 0 0-6 6H4a8 8 0 0 1 8-8zm0-1c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm9 6h1v5h-8v-5h1v-1a3 3 0 0 1 6 0v1zm-2 0v-1a1 1 0 0 0-2 0v1h2z" />
                            </g>
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium ">
                            Admin dashboard
                          </p>
                        </div>
                      </Link>
                    )}
                    {/* ------------------ only for not admins --------------------- */}
                    {!UserRoles().isAdmin() && (
                      <Link
                        href={loginRedirectURL as Route}
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      >
                        <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />

                            <g id="SVGRepo_iconCarrier">
                              {" "}
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M3.75 6.75L4.5 6H20.25L21 6.75V10.7812H20.25C19.5769 10.7812 19.0312 11.3269 19.0312 12C19.0312 12.6731 19.5769 13.2188 20.25 13.2188H21V17.25L20.25 18L4.5 18L3.75 17.25V13.2188H4.5C5.1731 13.2188 5.71875 12.6731 5.71875 12C5.71875 11.3269 5.1731 10.7812 4.5 10.7812H3.75V6.75ZM5.25 7.5V9.38602C6.38677 9.71157 7.21875 10.7586 7.21875 12C7.21875 13.2414 6.38677 14.2884 5.25 14.614V16.5L9 16.5L9 7.5H5.25ZM10.5 7.5V16.5L19.5 16.5V14.614C18.3632 14.2884 17.5312 13.2414 17.5312 12C17.5312 10.7586 18.3632 9.71157 19.5 9.38602V7.5H10.5Z"
                                fill="black"
                              />
                            </g>
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium ">
                            {textMyCouponsOrMyShop}
                          </p>
                        </div>
                      </Link>
                    )}
                    {/* ------------------ supplier dashboard ----------------- */}
                    {UserRoles().isSupplier() && (
                      <Link
                        href={"/app/dashboard/parceiro/perfil"}
                        className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      >
                        <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0" />

                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />

                            <g id="SVGRepo_iconCarrier">
                              {" "}
                              <path
                                d="M22 22H2"
                                stroke="#000000"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />{" "}
                              <path
                                d="M20 22V11"
                                stroke="#000000"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />{" "}
                              <path
                                d="M4 22V11"
                                stroke="#000000"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />{" "}
                              <path
                                d="M16.5278 2H7.47214C6.26932 2 5.66791 2 5.18461 2.2987C4.7013 2.5974 4.43234 3.13531 3.89443 4.21114L2.49081 7.75929C2.16652 8.57905 1.88279 9.54525 2.42867 10.2375C2.79489 10.7019 3.36257 11 3.99991 11C5.10448 11 5.99991 10.1046 5.99991 9C5.99991 10.1046 6.89534 11 7.99991 11C9.10448 11 9.99991 10.1046 9.99991 9C9.99991 10.1046 10.8953 11 11.9999 11C13.1045 11 13.9999 10.1046 13.9999 9C13.9999 10.1046 14.8953 11 15.9999 11C17.1045 11 17.9999 10.1046 17.9999 9C17.9999 10.1046 18.8953 11 19.9999 11C20.6373 11 21.205 10.7019 21.5712 10.2375C22.1171 9.54525 21.8334 8.57905 21.5091 7.75929L20.1055 4.21114C19.5676 3.13531 19.2986 2.5974 18.8153 2.2987C18.332 2 17.7306 2 16.5278 2Z"
                                stroke="#000000"
                                strokeWidth="1.5"
                                strokeLinejoin="round"
                              />{" "}
                              <path
                                d="M9.5 21.5V18.5C9.5 17.5654 9.5 17.0981 9.70096 16.75C9.83261 16.522 10.022 16.3326 10.25 16.201C10.5981 16 11.0654 16 12 16C12.9346 16 13.4019 16 13.75 16.201C13.978 16.3326 14.1674 16.522 14.299 16.75C14.5 17.0981 14.5 17.5654 14.5 18.5V21.5"
                                stroke="#000000"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                              />{" "}
                            </g>
                          </svg>
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium ">Minha loja</p>
                        </div>
                      </Link>
                    )}
                    {/* ------------------ 2 --------------------- */}
                    <div
                      className="flex cursor-pointer items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      onClick={() => {
                        close(), handleLogout();
                      }}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 ">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.90002 7.55999C9.21002 3.95999 11.06 2.48999 15.11 2.48999H15.24C19.71 2.48999 21.5 4.27999 21.5 8.74999V15.27C21.5 19.74 19.71 21.53 15.24 21.53H15.11C11.09 21.53 9.24002 20.08 8.91002 16.54"
                            stroke="black"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15 12H3.62"
                            stroke="black"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.85 8.6499L2.5 11.9999L5.85 15.3499"
                            stroke="black"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium">
                          {isLoading ? "Desconectando..." : "Desconectar"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};

export default AvatarDropdown;
