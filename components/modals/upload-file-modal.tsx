'use client'
import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useModal } from '@/stores/use-modal-store'

interface Props {}
export const UploadFileModal: React.FC<Props> = () => {
  const { isOpen, onClose } = useModal()
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This is Desc for dialog
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
