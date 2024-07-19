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

  console.log(1231, pathname)
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
        fixed bottom-0 w-full p-2 bg-indigo-300 text-white rounded-t-xl
        flex flex-row justify-between items-center
      "
    >
      <div
        className={cn("flex-1 text-center", {"bg-black": pathname===routesMap.home})}
        onClick={() => handleRouter('home')}
      >
        首页
      </div>
      <div className="flex-1 text-center">
        <div
          className="
            absolute bg-rose-300 -translate-x-[50%] left-[50%] bottom-[50%] rounded-full w-14 h-14 border shadow-xl
            flex justify-center items-center
            active:shadow-inner
          "
        >
          <button onClick={handleModalOpen}><FaPlus size={20} /></button>
        </div>
      </div>
      <div
        className={cn("flex-1 text-center", {"bg-black": pathname===routesMap.timeLine})}
        onClick={() => handleRouter('timeLine')}
      >
        时间轴
      </div>
    </div>
  )
}