'use client'
import type { Image, Post } from '@prisma/client'
import axios from 'axios'
import useSWR from 'swr'
import { PostItem } from '@/components/post-item'

interface Props { }
const PostsPage: React.FC<Props> = () => {
  const { data, isLoading, error } = useSWR(
    '/api/post',
    () => axios.get<{ resources: { items: (Post & { images: Image[] })[] } }>('/api/post'),
  )

  if (error)
    return <div>出错了</div>
  if (isLoading)
    return <div>加载中...</div>

  return (
    <div className="p-2">
      {data?.data.resources.items.length === 0
        ? <h3 className="absolute text-zinc-500 left-[20%] top-10">暂时没有动态哦，去发布吧~</h3>
        : data?.data.resources.items.map(post => (
          <PostItem key={post.id} post={post} />
        ))}
    </div>
  )
}

export default PostsPage
