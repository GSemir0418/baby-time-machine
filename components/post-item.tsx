import type { Image, Post } from '@prisma/client'
import dayjs from 'dayjs'
import React from 'react'

interface Props {
  post: Post & { images: Image[] }
}

const roleMap = {
  dad: {
    src: '/avatars/dad.png',
    label: '爸爸',
  },
  mom: {
    src: '/avatars/mom.png',
    label: '妈妈',
  },
} as const

export const PostItem: React.FC<Props> = ({ post }) => {
  return (
    <div className="flex flex-row gap-2 border-b p-1">
      <div className="w-14">
        <img src={roleMap[post.role as keyof typeof roleMap].src} />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="text-lg font-bold">
          {roleMap[post.role as keyof typeof roleMap].label}
        </div>
        <div className="text-zinc-700">
          {post.content}
        </div>
        <div className="grid grid-cols-3 gap-1">
          {post.images.map(image => (
            <img className="rounded-md" key={image.id} src={image.thumb_url} alt="" />
          ))}
        </div>
        <div className="text-sm text-zinc-400">
          {dayjs(post.create_time).format('YYYY-MM-DD hh:mm')}
        </div>
      </div>
    </div>
  )
}
