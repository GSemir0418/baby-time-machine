'use client'
import { cn } from "@/lib/utils";
import { useModal } from "@/stores/use-modal-store";
import { usePathname, useRouter } from "next/navigation";
import { FaPlus } from "react-icons/fa6";

const routesMap = {
  timeLine: '/time-line',
  home: '/'
}

export const Footer = () => {
  const { onOpen } = useModal()
  const pathname = usePathname()
  const router = useRouter()

  const handleModalOpen = () => {
    onOpen('create')
  }

  const handleRouter = (route: keyof typeof routesMap) => {
    if (pathname !== routesMap[route]) {
      router.push(routesMap[route])
    }
  }

  return (
    <div
      className="
        fixed bottom-0 w-full p-2 bg-white text-zinc-500 rounded-t-xl
        flex flex-row justify-between items-center
      "
    >
      <div
        className={cn("flex-1 text-center", {"text-lg font-bold text-pink-300": pathname===routesMap.home})}
        onClick={() => handleRouter('home')}
      >
        首页
      </div>
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
      <div
        className={cn("flex-1 text-center", {"text-lg font-bold text-pink-300": pathname===routesMap.timeLine})}
        onClick={() => handleRouter('timeLine')}
      >
        时间轴
      </div>
    </div>
  )
}