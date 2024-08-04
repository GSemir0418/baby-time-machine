'use client'
import React, { useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import { TimeLineItem } from '@/components/time-line-item'
import type { GroupBy, GroupMedia } from '@/next-env'
import { GroupRadio } from '@/components/group-radio'
import { SWRLoading } from '@/components/swr-loading'

const TimeLinePage: React.FC = () => {
  const [groupBy, setGroupBy] = useState<GroupBy>('month')

  const { data, isLoading, error } = useSWR(
    `/api/media/group?groupBy=${groupBy}`,
    async (url: string) => (await axios.get<{ resource: GroupMedia<typeof groupBy>[] }>(url)).data.resource,
  )

  if (error)
    return <div>出错了</div>
  if (isLoading)
    return <SWRLoading />

  return (
    <div className="p-2">
      <GroupRadio groupBy={groupBy} setGroupBy={setGroupBy} />
      {data?.length === 0
        ? (<h3 className="text-zinc-500 absolute left-[20%] top-10">暂时没有照片哦，先上传一张吧~</h3>)
        : data?.map(group => (
          <TimeLineItem key={group[groupBy]} group={group} groupBy={groupBy} />
        ),
        )}
    </div>
  )
}
export default TimeLinePage
