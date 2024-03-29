import { StaticImageData } from "next/image";
import { IAddress } from "../auth/request";
import { ICoupon } from "../coupons";

export interface iSupplierCategory {
  active: boolean;
  title: string;
  id: string;
}
export interface ISupplierInfo {
  _id: string;
  validCoupons: ICoupon[];
  coupons: ICoupon[];
  supplierCategory: iSupplierCategory;
  address: IAddress;
  isSupplier: boolean;
  isVerified: boolean;
  supplierBanner?: string;
  supplierLogo?: string;
  supplierDescription?: string;
}

export interface ISupplierUpdate {
  name: string;
  email: string;
  supplierInfo: Partial<ISupplierInfo>;
}

export interface ISupplier {
  name: string;
  active: boolean;
  role: string;
  document: string;
  numberOfCoupons: number;
  email: string;
  _id: string;
  id: string;
  supplierInfo: ISupplierInfo;
  phoneNumber: string;
  whatsappPhoneNumber: string;
}

export interface ISupplierResponse {
  supplier: ISupplier;
  coupons: ICoupon[];
  name: string;
  role: string;
}

export interface ISupplierList {
  name: string;
  isVerified: boolean;
  sortBy: string;
  supplierCategory: string;
  limit: number;
  page: number;
}

export interface IverifySupplier {
  id: string;
}

export interface ICategoryProps {
  active: boolean;
  title: string;
  id: string;
}

export interface ISupplierCompleteRegister {
  supplierLogo: string | StaticImageData;
  supplierBanner: string | StaticImageData;
  description: string;
}

export interface ISupplierLoginResponseProps {
  active: boolean;
  address: IAddress;
  coupons: ICoupon;
  email: string;
  id: string;
  isEmailVerified: boolean;
  isSupplier: boolean;
  isVerified: boolean;
  name: string;
  role: string;
}

export interface IDataResponse {
  page: number;
  name: string;
  sortBy: string;
  supplierInfo: {
    supplierCategory: string;
  };
}
