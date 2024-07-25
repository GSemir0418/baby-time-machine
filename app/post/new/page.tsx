import React from 'react'
import { PostForm } from '@/components/post-form'

interface Props {}
const PostPage: React.FC<Props> = () => {
  return (
    <div className='h-full m-10'>
      <PostForm />
    </div>
  )
}

export default PostPage
