import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    // 准备图片存储路径
    const savePath = path.join(process.cwd(), `public/upload/`)

    // 解析 formData
    const formData = await req.formData()
    const pic = formData.get('pic')
    const desc = formData.get('desc')
    const exifJson = formData.get('exifJson')

    if (!pic || !(pic instanceof File)) {
      return NextResponse.json({ error: '请上传有效照片' }, { status: 400 })
    }

    const buffer = Buffer.from(await pic.arrayBuffer())

    const filename = `${uuidv4()}.${pic.name.split('.').pop()}`
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

    // 将图片路径\描述\EXIF存储到数据库
    const img = await db.images.create({
      data: {
        url,
        thumb_url,
        exif: exifJson as string,
        desc: desc as string
      },
    })

    const resource = { img }
    return NextResponse.json({ resource, status: 201 })
  }
  catch (error) {
    console.log('Error occured ', error)
    return NextResponse.json({ error: 'Internal Error', status: 500 })
  }
}
