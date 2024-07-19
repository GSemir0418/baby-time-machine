import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: Request) {
  try {
    // 自带解析 formData 的方法
    const formData = await req.formData()

    const pic = formData.get('pic')
    console.log(pic)

    if (!pic || !(pic instanceof File)) {
      return NextResponse.json({ error: '请上传有效照片' }, { status: 400 })
    }

    const buffer = Buffer.from(await pic.arrayBuffer())

    const filename = `${uuidv4()}.${pic.name.split('.').pop()}`

    await writeFile(
      // 本地存放路径
      path.join(process.cwd(), `public/upload/${filename}`),
      buffer,
    )

    // 生成预览图
    

    // TODO：将图片路径\描述\EXIF存储到数据库

    const resource = {
      // 返回预览路径
      url: `http://localhost:3000/upload/${filename}`,
    }
    return NextResponse.json({ resource, status: 201 })
  }
  catch (error) {
    console.log('Error occured ', error)
    return NextResponse.json({ error: 'Internal Error', status: 500 })
  }
}
