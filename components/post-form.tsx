'use client'
import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import ExifReader from 'exifreader'
import { MdCancel } from 'react-icons/md'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const MAX_FILE_SIZE = 20 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

const formSchema = z.object({
  images: z
    .any()
    .refine(files => files && files.length >= 1, { message: '照片不能为空' })
    .refine((files: FileList) =>
      files && Array.from(files).filter(f => !ACCEPTED_IMAGE_TYPES.includes(f.type)).length === 0, {
      message: '仅支持 .jpg, .jpeg, .png .webp 类型',
    })
    .refine((files: FileList) => files && Array.from(files).some(f => f.size <= MAX_FILE_SIZE), {
      message: `文件尺寸不能超过 20MB.`,
    }),
  content: z.string({
    required_error: '请描述一下这一时刻',
  }).min(1, { message: '请描述一下这一时刻' }),
  role: z.string({
    required_error: '请选择您的身份',
  }),
})

interface Props { }
export const PostForm: React.FC<Props> = () => {
  const [selectedImages, setSelectedImages] = useState<File[] | null>(null)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: undefined,
      content: '',
      role: 'dad',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData()
      const fileArr: File[] = Array.from(values.images)
      for (const file of fileArr) {
        const tags = await ExifReader.load(file)
        const exifJson = JSON.stringify(tags)
        formData.append('images', file)
        formData.append('exifJson', exifJson)
      }
      formData.append('content', values.content)
      formData.append('role', values.role)

      await axios.post('/api/post', formData)

      router.push('/post')
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <>
              <FormItem className="flex flex-row items-baseline mt-4">
                <FormLabel className="flex-shrink-0">描述</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    className="flex-1 ml-2 mt-0"
                    disabled={isLoading}
                    placeholder="记录这一重要时刻"
                    {...field}
                  />
                </FormControl>
              </FormItem>
              <FormMessage className="block" />
            </>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="flex flex-row items-baseline mt-4">
              <FormLabel className="flex-shrink-0">角色</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="flex-1 ml-2 mt-0">
                    <SelectValue placeholder="您是宝宝的？" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mom">妈妈</SelectItem>
                  <SelectItem value="dad">爸爸</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>照片</FormLabel>
              <FormControl>
                <Button disabled={isLoading} type="button" variant="outline" className="ml-2">
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    id="fileInput"
                    accept="image/*"
                    onBlur={field.onBlur}
                    name={field.name}
                    onChange={(e) => {
                      if (e.target.files) {
                        field.onChange(e.target.files)
                        setSelectedImages(Array.from(e.target.files)?.slice(0, 9) || null)
                      }
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
              {selectedImages && (
                <div className="grid grid-cols-3 gap-1 pt-2">
                  {selectedImages.map((img, i) => (
                    <span className="relative">
                      <MdCancel
                        size={20}
                        color="#ef4444"
                        onClick={() => {
                          // 移除 FileList 对应的图片，以及预览图
                          const inputFileList: FileList = form.getValues('images')
                          const fileArray = Array.from(inputFileList)
                          fileArray.splice(i, 1)
                          const dataTransfer = new DataTransfer()
                          fileArray.forEach((file) => {
                            dataTransfer.items.add(file)
                          })
                          field.onChange(dataTransfer.files)
                          // 移除预览图
                          setSelectedImages((prev) => {
                            prev?.splice(i, 1)
                            return prev
                          })
                        }}
                        className="absolute -right-[6px] -top-[6px]"
                      />
                      <img
                        key={i}
                        className="rounded-md"
                        src={URL.createObjectURL(img)}
                        alt="Selected"
                      />
                    </span>
                  ))}
                </div>
              )}
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-pink-300 w-full mt-6" disabled={isLoading}>保存</Button>
      </form>
    </Form>
  )
}
