import { PostItem } from '@/components/post-item'
import { db } from '@/lib/db'

interface Props { }
const PostsPage: React.FC<Props> = async () => {
  const posts = await db.post.findMany({
    include: {
      images: true,
    },
  })

  return (
    <div className='p-2'>
      {posts.length === 0
        ? <h3 className="absolute text-zinc-500 left-[20%] top-10">暂时没有动态哦，去发布吧~</h3>
        : posts.map(post => (
          <PostItem key={post.id} post={post} />
        ))}
    </div>
  )
}

export default PostsPage
