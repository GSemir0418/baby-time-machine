'use client'
import useSWR from 'swr'
import axios from 'axios'
import type { Image } from '@prisma/client'

export default function Home() {
  const { data, error, isLoading } = useSWR(
    '/api/media',
    () => axios.get<{ resources: { items: Image[] } }>('/api/media'),
  )

  if (error)
    return <div>出错了</div>
  if (isLoading)
    return <div>加载中...</div>

  return (
    <div className="bg-transparent grid grid-cols-3 sm:grid-cols-4 gap-1 p-2">
      {data?.data.resources.items.length === 0
        ? <h3 className="absolute text-zinc-500 left-[20%] top-10">暂时没有照片哦，先上传一张吧~</h3>
        : data?.data.resources.items.map(i => (
          <img key={i.id} className="rounded-lg" src={i.thumb_url} />
        ))}
    </div>
  )
}
