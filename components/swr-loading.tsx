import React from 'react'
import { VscLoading } from 'react-icons/vsc'

export const SWRLoading: React.FC = () => {
  return (
    <div className="h-full flex justify-center items-center text-xl text-pink-300 gap-4 font-bold">
      <VscLoading className="animate-spin" size={40} />
      加载中..
    </div>
  )
}
