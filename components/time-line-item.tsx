import React from 'react'
import { FaRegDotCircle } from 'react-icons/fa'
import dayjs from 'dayjs'
import type { GroupBy, GroupMedia } from '@/next-env'

interface Props {
  groupBy: GroupBy
  group: GroupMedia<Props['groupBy']>
}

export const TimeLineItem: React.FC<Props> = ({ group, groupBy }) => {
  const title = dayjs(group[groupBy]).format(groupBy === 'month' ? 'YYYY-MM' : 'YYYY')
  return (
    <div className="relative border-b w-full h-28 flex items-center p-2">
      <span className="absolute top-0 left-4 h-full w-[1px] bg-pink-200 -z-10" />
      <FaRegDotCircle className="block mr-2 mt-4" color="#f9a8d4" />
      <div className="flex-1 flex flex-col">
        <span className="text-zinc-500">{title}</span>
        <div className="flex-1 grid grid-cols-3 gap-2 grid-rows-1">
          {group.items.map((i, index) => (
            index < 3 && <img key={i.id} src={i.thumbUrl} className="rounded-md h-20 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
