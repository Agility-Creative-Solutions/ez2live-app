import {
  IForgotPassword,
  ILogIn,
  IRegisterAccount,
  IResetPassword,
} from "@/types/auth/request";
import { BaseService } from "./base.service";
import { ILoginResponse } from "@/types/auth/response";

const login = async (data: ILogIn) => {
  return await BaseService.fetchData<ILoginResponse>({
    url: "/auth/login",
    method: "post",
    data,
  });
};

const loginSocial = async (data: any) => {
  return await BaseService.fetchData<ILoginResponse>({
    url: "/auth/login/social",
    method: "post",
    data,
  });
};

const register = async (data: Partial<IRegisterAccount>) => {
  return await BaseService.fetchData({
    url: "/auth/register",
    method: "post",
    data,
  });
};

const forgotPassword = async (data: IForgotPassword) => {
  return await BaseService.fetchData({
    url: "/auth/forgot-password",
    method: "post",
    data,
  });
};

const resendEmailVerification = async (id: string) => {
  return await BaseService.fetchData({
    url: `/auth/send-verification-email?id=${id}`,
    method: "post",
  });
};

const resetPassword = async (data: IResetPassword) => {
  return await BaseService.fetchData({
    url: `/auth/reset-password`,
    method: "post",
    data,
  });
};

const refreshToken = async (data: any) => {
  return await BaseService.fetchData({
    url: "/auth/refresh-tokens",
    data,
    method: "post",
  });
};

const getUserByEmail = async (email: string) => {
  return await BaseService.fetchData({
    url: `/users/by-email?email=${email}`,
    method: "get",
  });
};

const authService = {
  login,
  loginSocial,
  register,
  forgotPassword,
  resetPassword,
  refreshToken,
  resendEmailVerification,
  getUserByEmail,
};

export default authService;
