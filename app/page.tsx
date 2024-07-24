import { db } from '@/lib/db'

export default async function Home() {
  const images = await db.images.findMany()

  return (
    <div className="bg-transparent grid grid-cols-3 sm:grid-cols-4 gap-1 p-2">
      {images.length === 0 && <h3 className="absolute text-zinc-500 left-[20%] top-10">暂时没有照片哦，先上传一张吧~</h3>}
      {images.map(i => (
        <img key={i.id} className="rounded-lg" src={i.thumb_url} />
      ))}
    </div>
  )
}
