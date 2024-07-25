/* eslint-disable node/prefer-global/buffer */
/* eslint-disable node/prefer-global/process */
import path from 'node:path'
import { writeFile } from 'node:fs/promises'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'
import ExifReader from 'exifreader'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    // 准备图片存储路径
    const savePath = path.join(process.cwd(), `public/upload/`)

    // 解析 formData
    // node 没有对 FileList 的实现，因此无法处理
    // 需要前端直接传递 File[]
    const formData = await req.formData()
    const imageArr = formData.getAll('images') as File[] | null
    const exifJsonArr = formData.getAll('exifJson') as string[] | null
    const content = formData.get('content')
    const role = formData.get('role')

    if (!imageArr || imageArr.some(i => !(i instanceof File))) {
      return NextResponse.json({ error: '请上传有效照片' }, { status: 400 })
    }

    const data = []

    // 保存数据到 post 表
    const post = await db.post.create({
      data: {
        role: role as string,
        content: content as string,
      },
    })

    for (let i = 0; i < imageArr.length; i++) {
      const image = imageArr[i]
      const exifJson = exifJsonArr?.[i] ?? ""
      // 处理保存路径
      const buffer = Buffer.from(await image.arrayBuffer())

      const filename = `${uuidv4()}.${image.name.split('.').pop()}`
      const fileThumbName = `${filename}_thumbnail.jpg`

      const filePath = path.join(savePath, filename)
      const fileThumbPath = path.join(savePath, fileThumbName)

      const url = `/upload/${filename}`
      const thumb_url = `/upload/${fileThumbName}`

      // 存储到本地
      await writeFile(filePath, buffer)

      // 使用 sharp 生成预览图
      await sharp(buffer)
        .resize(200, 200)
        .jpeg({ quality: 80 }) // 设置图片质量
        .toFile(fileThumbPath)

      data.push({
        url,
        thumb_url,
        exif: exifJson,
        postId: post.id,
      })
    }

    // 将图片路径\描述\EXIF存储到数据库
    await db.image.createMany({ data })

    return NextResponse.json({ resource: { post }, status: 201 })
  }
  catch (error) {
    console.log('Error occured ', error)
    return NextResponse.json({ error: 'Internal Error', status: 500 })
  }
}
