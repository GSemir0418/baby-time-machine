import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'

export async function POST(req: Request) {
  try {
    // 准备图片存储路径
    const savePath = path.join(process.cwd(), `public/upload/`)

    // 解析 formData
    const formData = await req.formData()
    const pic = formData.get('pic')

    if (!pic || !(pic instanceof File)) {
      return NextResponse.json({ error: '请上传有效照片' }, { status: 400 })
    }

    const buffer = Buffer.from(await pic.arrayBuffer())

    const filename = `${uuidv4()}.${pic.name.split('.').pop()}`
    const fileThumbName = `${filename}_thumbnail.jpg`

    // 存储到本地
    await writeFile(path.join(savePath, filename), buffer)

    // 使用 sharp 生成预览图
    await sharp(buffer)
      .resize(200, 200)
      .jpeg({ quality: 80 }) // 设置图片质量
      .toFile(path.join(savePath, fileThumbName))

    // TODO：将图片路径\描述\EXIF存储到数据库

    const resource = {
      // 返回预览路径
      thumbURL: `http://localhost:3000/upload/${fileThumbName}`,
    }
    return NextResponse.json({ resource, status: 201 })
  }
  catch (error) {
    console.log('Error occured ', error)
    return NextResponse.json({ error: 'Internal Error', status: 500 })
  }
}
