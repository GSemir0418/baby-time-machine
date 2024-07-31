'use client'
import axios from 'axios'
import type { Image } from '@prisma/client'
import { Loader2 } from 'lucide-react'
import useSWRInfinite from 'swr/infinite'
import { MEDIA_BATCH } from './api/media/route'

function getKey(pageIndex: number, previousPageData: { items: Image[], nextCursor: string }) {
  // 第一页，不传 cursor，正常请求
  if (pageIndex === 0)
    return `/api/media`

  // 已经到底了
  if (previousPageData && !previousPageData.items.length)
    return null

  // 在 url 上添加 cursor
  return `/api/media?cursor=${previousPageData.nextCursor}`
}

async function fetcher(url: string) {
  const res = await axios.get<{ resources: { items: Image[], nextCursor: string } }>(url)
  return res.data.resources
}

export default function Home() {
  const { data, error, isLoading, size, setSize } = useSWRInfinite(getKey, fetcher)

  const isEmpty = data?.[0]?.items.length === 0
  const isReachingEnd
    = isEmpty || (data && data[data.length - 1]?.items.length < MEDIA_BATCH)

  if (error)
    return <div>出错了</div>
  if (isLoading)
    return <div>加载中...</div>

  return (
    <div className="h-full overflow-y-auto pb-14">
      <div className="bg-transparent grid grid-cols-3 sm:grid-cols-4 gap-1 p-2">
        {data?.map((resources) => {
          return resources.items.length === 0
            ? <h3 className="absolute text-zinc-500 left-[20%] top-10">暂时没有照片哦，先上传一张吧~</h3>
            : resources.items.map(i => (
              <img key={i.id} className="rounded-lg" src={i.thumb_url} />
            ))
        })}
      </div>
      <div className="flex justify-center">
        {isLoading
          ? (
              <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
            )
          : isReachingEnd
            ? (
                <span className="text-zinc-500">没有更多了</span>
              )
            : (
                <button
                  onClick={() => setSize(size + 1)}
                  className="text-zinc-500"
                >
                  加载更多
                </button>
              )}
      </div>
    </div>
  )
}
