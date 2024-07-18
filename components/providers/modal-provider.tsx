'use client'
import { useEffect, useState } from 'react'
import { UploadFileModal } from '../modals/upload-file-modal'

export function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted)
    return null

  return (
    <>
      <UploadFileModal />
    </>
  )
}
