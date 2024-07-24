import React from 'react'
import { FaRegDotCircle } from 'react-icons/fa'
import dayjs from 'dayjs'
import type { GroupMedia } from '@/app/time-line/page'

interface Props {
  group: GroupMedia
}
export const TimeLineItem: React.FC<Props> = ({ group }) => {
  const month = dayjs(group.month).format('YYYY-MM')
  return (
    <div className="border-b w-full h-28 flex items-center p-2">
      <FaRegDotCircle className='block mr-2 mt-4'/>
      <div className="flex-1 flex flex-col">
        <span className='text-zinc-500'>{month}</span>
        <div className="flex-1 grid grid-cols-3 gap-1 grid-rows-1">
          {group.items.map((i, index) => (
            index < 3 && <img key={i.id} src={i.thumbUrl} className="rounded-md h-20 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}
