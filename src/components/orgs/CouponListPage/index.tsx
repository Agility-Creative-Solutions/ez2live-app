"use client";

import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { Avaliation, SupplierCoupons, ButtonSecondary, CreateCoupon, ButtonThird } from '@/components/atoms';
import { ISupplier } from '@/types/supplier';
import ArrowLeft from '@/images/easytolive/icons/arrow-next-right-white.svg'
import supplierService from '@/service/supplier.service';
import { useToastify } from '@/hooks/useToastify';
import CouponPrimary from '@/images/easytolive/icons/couponPrimary.svg'
import Arrow from '@/images/easytolive/icons/arrow-next-right-primary.svg';
import Edit from '@/images/easytolive/icons/edit.svg';
import LogoImage from '@/images/easytolive/logo/logotipo-fundoazulroxo.svg';
import { getItemByLocalStorage } from '@/utils/localStorageHelper';
import { userLoginResponseProps } from '@/types/user';
import { ModalEdit } from '@/components/mols';

interface ICouponListPageProps {
  supplierId: string,
};

const CouponListPage: React.FC<ICouponListPageProps> = ({
  supplierId
}) => {
  const [supplier, setSupplier] = useState<ISupplier>();
  const [user, setUser] = useState<userLoginResponseProps>();
  const [modalCreateCoupon, setModalCreateCoupon] = useState(false);

  const getSupplierById = async (id: string) => {
    const res: any = await supplierService.getSupplierById(id);
    return res;
  };

  useEffect(() => {
    const user = getItemByLocalStorage('user')
    if (user) setUser(user);

    getSupplierById(supplierId)
      .then((res) => { setSupplier(res?.data?.supplier) })
      .catch((error) => {
        if (error?.response?.data?.code === 400) {
          useToastify({ label: 'Oops! Parece que você acessou um endereço de estabelecimento errado', type: 'error' })
        }
      })

  }, []);


  return (
    <div className="relative md:w-[500px] h-full w-full mx-auto">
      <ModalEdit
        show={modalCreateCoupon}
        onCloseModalEdit={() => setModalCreateCoupon(false)}>
        <div className='flex flex-col items-center'>
          <CreateCoupon />
          <ButtonThird
            className='text-generic-alertRed'
            onClick={() => setModalCreateCoupon(false)}>cancelar</ButtonThird>
        </div>
      </ModalEdit>
      <div className='h-40 w-full bg-gradient-to-r from-primary-lighter to-primary-main'>
      </div>
      <Link className='absolute flex items-center justify-center rounded-full top-4 left-4 cursor-pointer h-8 w-8 bg-neutral-400 opacity-75 rotate-180'
        href={'/'}>
        <Image
          className='w-6 h-auto'
          alt='arrow-left'
          src={ArrowLeft} />
      </Link>
      <Image className='absolute rounded-full w-20 h-auto top-8 right-4' src={LogoImage} alt='Logo-restaurante' />
      <div className='px-5 py-6 -mt-6 rounded-t-3xl bg-generic-background w-full h-full'>
        <div className='flex items-center justify-between'>
          <div className='flex gap-1'>
            <Link href={`/`} className='text-xs underline'>
              {supplier?.supplierCategory.title}
            </Link>
            <p className='text-xs'>
              / {supplier?.name}
            </p>
          </div>
          <div className='flex flex-col'>
            <Avaliation note={'4.7'} />
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <Image
            className='w-12 my-4 h-auto rounded-full'
            alt='Logo Image'
            src={LogoImage}
          />
          <div>
            {supplier?.id == user?.id && <ButtonSecondary
              onClick={() => setModalCreateCoupon(true)}>
              <Image src={CouponPrimary}
                className='w-6 mr-3 h-auto' alt='coupon-image' />
              Novo Cupom
            </ButtonSecondary>}

          </div>

        </div>
        <h2 className=' text-xl font-semibold'>{supplier?.name}</h2>
        <p className='pt-2 text-xs text-gray-400'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi vero velit quam repellendus facere ea recusandae, sapiente repudiandae perspiciatis temporibus
          et exercitatione illum nobis corrupti, sunt voluptates perferendis dicta fugiat.</p>
        <div className='mt-6 pb-16 flex flex-col gap-4'>

          {supplier && (Array.isArray(supplier?.coupons) && supplier.coupons.length > 0)
            ? (supplier?.coupons.map((coupon, key) => (
              <SupplierCoupons
                icon={supplier.id == user?.id ? Edit : Arrow}
                discount={coupon.discount}
                expirateTime={5}
                unintsAmount={20}
                key={key}
              />
            ))) : (
              <em className="text-xs">Nenhum cupom foi criado ainda...</em>
            )
          }

        </div>
      </div>
      <span className='md:w-[500px] fixed bottom-0 text-neutral-400 w-full flex justify-center items-center h-16 bg-alternative-darker'>
        Todos os direitos reservados
      </span>
    </div>
  );
}

export default CouponListPage;