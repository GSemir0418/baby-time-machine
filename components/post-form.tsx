'use client'
import React, { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import ExifReader from 'exifreader'
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
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>照片</FormLabel>
              {selectedImages && (
                <div className="max-w-[200px] ml-2">
                  {selectedImages.map((img, i) => (
                    <img
                      key={i}
                      className="rounded-md"
                      src={URL.createObjectURL(img)}
                      alt="Selected"
                    />
                  ))}
                </div>
              )}
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
                      console.log('e.target', e.target.files)
                      if (e.target.files) {
                        field.onChange(e.target.files)
                        setSelectedImages(Array.from(e.target.files) || null)
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
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex flex-row items-baseline">
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
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="flex flex-row items-baseline">
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
        <Button type="submit" className="w-full sm:w-24 mt-2" disabled={isLoading}>保存</Button>
      </form>
    </Form>
  )
}
