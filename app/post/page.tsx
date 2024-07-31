'use client'
import type { Image, Post } from '@prisma/client'
import axios from 'axios'
import useSWRInfinite from 'swr/infinite'
import { Loader2 } from 'lucide-react'
import { PostItem } from '@/components/post-item'

const POSTS_BATCH = 5
type PostWithImagesType = Post & { images: Image[] }

async function fetcher(url: string) {
  const res = await axios.get<{ resources: { items: PostWithImagesType[], nextCursor: string } }>(url)
  return res.data.resources
}
function getKey(pageIndex: number, previousPageData: { items: PostWithImagesType[], nextCursor: string }) {
  // 第一页，不传 cursor，正常请求
  if (pageIndex === 0)
    return `/api/post`

  // 已经到底了
  if (previousPageData && !previousPageData.items.length)
    return null

  // 在 url 上添加 cursor
  return `/api/post?cursor=${previousPageData.nextCursor}`
}

function PostsPage() {
  const { data, error, isLoading, size, setSize } = useSWRInfinite(getKey, fetcher)

  const isEmpty = data?.[0]?.items.length === 0
  const isReachingEnd
  = isEmpty || (data && data[data.length - 1]?.items.length < POSTS_BATCH)

  if (error)
    return <div>出错了</div>
  if (isLoading)
    return <div>加载中...</div>

  return (
    <div className="h-full overflow-y-auto p-2 pb-14">
      {data?.map((resources) => {
        return resources.items.length === 0
          ? <h3 className="absolute text-zinc-500 left-[20%] top-10">暂时没有动态哦，去发布吧~</h3>
          : resources.items.map(post => (
            <PostItem key={post.id} post={post} />
          ))
      })}
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

export default PostsPage
