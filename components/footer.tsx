'use client'
import { usePathname, useRouter } from 'next/navigation'
import { FaPlus } from 'react-icons/fa6'
import { BiNews, BiPhotoAlbum, BiTimeFive, BiUser } from 'react-icons/bi'
import { useModal } from '@/stores/use-modal-store'
import { cn } from '@/lib/utils'

interface FooterItemProps {
  title: keyof typeof iconTitleMap
  route: string
}

const iconTitleMap = {
  首页: BiPhotoAlbum,
  时间轴: BiTimeFive,
  动态: BiNews,
  我的: BiUser,
} as const

const FooterItem: React.FC<FooterItemProps> = ({ title, route }) => {
  const pathname = usePathname()
  const router = useRouter()

  const handleRouter = (route: string) => {
    if (pathname !== route) {
      router.push(route)
    }
  }

  const Icon = iconTitleMap[title]

  return (
    <div
      className={cn('flex-1 flex flex-row flex-nowrap justify-center items-center', { 'font-bold text-pink-300': pathname === route })}
      onClick={() => handleRouter(route)}
    >
      <Icon className="inline mr-1" />
      {title}
    </div>
  )
}

export function Footer() {
  const { onOpen } = useModal()

  const router = useRouter()
  const handleModalOpen = () => {

    router.push('/post/new')
    // onOpen('create')
  }

  return (
    <div
      className="
        fixed bottom-0 w-full p-2 bg-white text-zinc-500 rounded-t-xl
        flex flex-row justify-between items-center
      "
    >
      <FooterItem title="首页" route="/" />
      <FooterItem title="时间轴" route="/time-line" />
      <div className="flex-1 text-center">
        <div
          className="
            absolute bg-white -translate-x-[50%] left-[50%] bottom-[20%] rounded-full w-12 h-12
            flex justify-center items-center
            active:shadow-inner
          "
        >
          <button className="bg-pink-300 shadow-xl rounded-full w-[80%] h-[80%] flex justify-center items-center" onClick={handleModalOpen}><FaPlus size={20} /></button>
        </div>
      </div>
      <FooterItem title="动态" route="/news" />
      <FooterItem title="我的" route="/me" />
    </div>
  )
}
