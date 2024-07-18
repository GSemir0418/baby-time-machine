'use client'
import { Button } from '@/components/ui/button'
import { useModal } from '@/stores/use-modal-store'

export default function Home() {
  const { onOpen } = useModal()

  const handleModalOpen = () => {
    onOpen('create')
  }

  return (
    <div>
      This is Home page
      <Button variant="outline" onClick={handleModalOpen}>open modal</Button>
    </div>
  )
}
