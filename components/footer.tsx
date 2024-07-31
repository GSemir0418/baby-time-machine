'use client'
import { usePathname, useRouter } from 'next/navigation'
import { BiNews, BiPhotoAlbum, BiTimeFive, BiUser } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { FooterAddMenu } from './footer-add-menu'
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
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted)
    return null

  return (
    <div
      className="
        fixed bottom-0 w-full p-2 bg-white text-zinc-500 rounded-t-xl
        flex flex-row justify-between items-center
      "
    >
      <FooterItem title="首页" route="/" />
      <FooterItem title="时间轴" route="/time-line" />
      <FooterAddMenu />
      <FooterItem title="动态" route="/post" />
      <FooterItem title="我的" route="/me" />
    </div>
  )
}
