'use client'
import type { Image } from '@prisma/client'
import axios from 'axios'
import dayjs from 'dayjs'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import useSWR from 'swr'
import { IoCaretBackOutline } from 'react-icons/io5'
import { Button } from '@/components/ui/button'

export const PreviewPage: React.FC = () => {
  const router = useRouter()
  const { mediaId } = useParams()
  const { data, error, isLoading } = useSWR(
    `/api/media/${mediaId}`,
    async url => (await axios.get<{ resource: Image }>(url)).data.resource,
  )

  if (error)
    return <div>出错了</div>
  if (isLoading)
    return <div>加载中...</div>
  const exifObj = JSON.parse(data?.exif as string)
  const dateTimeDigitized = exifObj?.DateTimeDigitized?.value?.[0]
  const device = exifObj?.['Device Manufacturer']?.value

  console.log(JSON.parse(data?.exif))

  const handleBackClick = () => {
    router.back()
  }
  return (
    <div className="h-full p-2 bg-zinc-900 text-white overflow-y-auto pb-14">
      <div className="flex flex-row items-center mb-2">
        <IoCaretBackOutline className="mr-auto" onClick={handleBackClick} />
        <span className="mr-auto text-xl">预览</span>
      </div>
      <img src={data?.url} />
      <div className='mt-4 mb-4 text-lg'>
        <div className='overflow-hidden w-full border-b-2 border-zinc-600 mb-2 pb-2'>
          <div>描述</div>
          <p className='text-wrap break-all text-sm text-zinc-400 mt-2'>{data?.desc ?? "暂无描述"}</p>
        </div>
        <div className='overflow-hidden w-full border-b-2 border-zinc-600 mb-2 pb-2'>
          <div>拍摄时间</div>
          <span className='text-zinc-400'>{dateTimeDigitized}</span>
        </div>
        <div className='overflow-hidden w-full border-b-2 border-zinc-600 mb-2 pb-2'>
          <div>拍摄设备</div>
          <p className='text-wrap break-all text-zinc-400'>{device ?? "暂无"}</p>
        </div>
      </div>
      <Button className='text-xl w-full bg-pink-400'>导出为拍立得</Button>
    </div>
  )
}

export default PreviewPage
