import { NextResponse } from 'next/server'
import type { images } from '@prisma/client'

const IMAGES_BATCH = 10
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const cursor = searchParams.get('cursor')

    const images: images[] = []
    if (cursor) {
      // messges = await db.directMessage.findMany({
      //   take: MESSAGES_BATCH,
      //   skip: 1,
      //   cursor: {
      //     id: cursor,
      //   },
      //   where: {
      //     conversationId,
      //   },
      //   include: {
      //     member: {
      //       include: {
      //         profile: true,
      //       },
      //     },
      //   },
      //   orderBy: {
      //     createdAt: 'desc',
      //   },
      // })
    }
    else {
      // messges = await db.directMessage.findMany({
      //   take: MESSAGES_BATCH,
      //   where: {
      //     conversationId,
      //   },
      //   include: {
      //     member: {
      //       include: {
      //         profile: true,
      //       },
      //     },
      //   },
      //   orderBy: {
      //     createdAt: 'desc',
      //   },
      // })
    }

    let nextCursor = null
    if (images.length === IMAGES_BATCH)
      nextCursor = images[IMAGES_BATCH - 1].id

    return NextResponse.json({
      resources: {
        items: images,
        nextCursor,
      },
      status: 200,
    })
  }
  catch (error) {
    console.log('Error occured ', error)
    return NextResponse.json({ error: 'Internal Error', status: 500 })
  }
}
