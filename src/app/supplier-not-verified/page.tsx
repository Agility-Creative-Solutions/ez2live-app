"use client"

import { ButtonPrimary } from '@/components';
import React from 'react';
import { useRouter } from "next/navigation";
import { removeItemFromLocalStorage } from '@/utils/localStorageHelper';
import Image from 'next/image';
import EmailIcon from '@/images/easytolive/icons/email-primary.svg';

const SupplierNotVerified = ()=> {
  const router = useRouter();

  const handleClick = ()=> {
    removeItemFromLocalStorage('user')
    router.push('/')
  }

  return (
    <div className='bg-primary-ez2livebg h-[80vh] flex flex-col items-center justify-between'>
      <span></span>
      <div className='flex flex-col items-center text-center text-sm font-bold max-w-xs'>
        <span className='w-24 h-24 flex items-center justify-center rounded-full bg-gradient-to-r from-secondary-ez2live_600 to-white mb-10'>
        <Image className='w-12 h-auto' alt='email-image' src={EmailIcon}/>
        </span>
      <p>Obrigado pelo seu cadastro, é muito bom ter você com a gente!</p>
      <p>Agora é só aguardar, você receberá um email quando seu cadastro for aprovado!</p>
      </div>
      <ButtonPrimary className='w-full max-w-xs' onClick={()=> handleClick()}>Conheça nosso site!</ButtonPrimary>
    </div>
  )
}

export default SupplierNotVerified;