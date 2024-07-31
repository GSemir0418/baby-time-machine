'use client'
import React from 'react'
import useSWR from 'swr'
import axios from 'axios'
import { TimeLineItem } from '@/components/time-line-item'

export interface GroupMedia {
  month: string
  items: {
    id: string
    thumbUrl: string
    createTime: string
  }[]
}

interface Props { }
const TimeLinePage: React.FC<Props> = () => {
  const { data, isLoading, error } = useSWR(
    '/api/media/group',
    () => axios.get<{ resource: GroupMedia[] }>('/api/media/group'),
  )

  console.log(data)

  if (error)
    return <div>出错了</div>
  if (isLoading)
    return <div>加载中...</div>

  return (
    <>
      {data?.data.resource.length === 0
        ? (<h3 className="text-zinc-500 absolute left-[20%] top-10">暂时没有照片哦，先上传一张吧~</h3>)
        : data?.data.resource.map(group => (
          <TimeLineItem key={group.month} group={group} />
        ),
        )}
    </>
  )
}
export default TimeLinePage
