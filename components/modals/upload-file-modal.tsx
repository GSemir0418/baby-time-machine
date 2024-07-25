'use client'
import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ExifReader from 'exifreader'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useModal } from '@/stores/use-modal-store'

const MAX_FILE_SIZE = 20 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

const formSchema = z.object({
  pic: z
    .any()
    .refine(files => files?.length >= 1, { message: '照片不能为空' })
    .refine((files) => {
      return ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type)
    }, {
      message: '仅支持 .jpg, .jpeg, .png .webp 类型',
    })
    .refine(files => files?.[0]?.size <= MAX_FILE_SIZE, {
      message: `文件尺寸不能超过 20MB.`,
    }),
  desc: z.string(),
})

interface Props { }
export const UploadFileModal: React.FC<Props> = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const { isOpen, type, onClose } = useModal()
  const router = useRouter()

  const open = isOpen && type === 'create'

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pic: undefined,
      desc: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const handleClose = () => {
    setSelectedImage(null)
    form.reset()
    onClose()
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const file = values.pic[0]
      const tags = await ExifReader.load(file as File)
      const exifJson = JSON.stringify(tags)

      const formData = new FormData()
      formData.append('pic', values.pic[0])
      formData.append('desc', values.desc)
      formData.append('exifJson', exifJson)

      await axios.post('/api/upload', formData)

      handleClose()
      router.refresh()
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-3/4 sm:w-full">
        <DialogHeader>
          <DialogTitle>上传照片</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="pic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>照片</FormLabel>
                  {selectedImage && (
                    <div className="max-w-[200px] ml-2">
                      <img
                        className="rounded-md"
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected"
                      />
                    </div>
                  )}
                  <FormControl>
                    <Button disabled={isLoading} type="button" variant="outline" className="ml-2">
                      <input
                        type="file"
                        className="hidden"
                        id="fileInput"
                        accept="image/*"
                        onBlur={field.onBlur}
                        name={field.name}
                        onChange={(e) => {
                          field.onChange(e.target.files)
                          setSelectedImage(e.target.files?.[0] || null)
                        }}
                        ref={field.ref}
                      />
                      <label
                        htmlFor="fileInput"
                        className="text-neutral-90 rounded-md cursor-pointer flex items-center"
                      >
                        <span className="whitespace-nowrap">
                          选择照片
                        </span>
                      </label>
                    </Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="desc"
              render={({ field }) => (
                <FormItem className="flex flex-row items-baseline">
                  <FormLabel className="flex-shrink-0">描述</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      className="flex-1 ml-2 mt-0"
                      disabled={isLoading}
                      placeholder="一句话描述下照片吧"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-24 mt-2" disabled={isLoading}>保存</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
