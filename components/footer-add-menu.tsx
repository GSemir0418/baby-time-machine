'use client'
import React from 'react'
import { FaCameraRetro, FaPlus, FaRegImage } from 'react-icons/fa'

import { useRouter } from 'next/navigation'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export const FooterAddMenu: React.FC = () => {
  const router = useRouter()
  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger className="flex-1 text-center">
        <div
          className="
            absolute bg-white -translate-x-[50%] left-[50%] bottom-[20%] rounded-full w-16 h-16
            flex justify-center items-center
            active:shadow-inner
          "
        >
          <button className="bg-pink-300 shadow-xl rounded-full w-[80%] h-[80%] flex justify-center items-center"><FaPlus size={30} className="text-white" /></button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" sideOffset={48}>
        <DropdownMenuItem className="text-zinc-600 text-base gap-2" onSelect={() => router.push('/post/new')}>
          <FaCameraRetro />
          发布动态
        </DropdownMenuItem>
        <DropdownMenuItem className="text-zinc-600 text-base gap-2" onSelect={() => router.push('/media/upload')}>
          <FaRegImage />
          上传照片
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
