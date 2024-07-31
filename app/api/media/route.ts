import { NextResponse } from 'next/server'
import type { Image } from '@prisma/client'
import { db } from '@/lib/db'

export const MEDIA_BATCH = 18
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const cursor = searchParams.get('cursor')

    let images: Image[]
    if (cursor) {
      images = await db.image.findMany({
        take: MEDIA_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        orderBy: {
          create_time: 'desc',
        },
      })
    }
    else {
      images = await db.image.findMany({
        take: MEDIA_BATCH,
        orderBy: {
          create_time: 'desc',
        },
      })
    }

    let nextCursor = null
    if (images.length === MEDIA_BATCH)
      nextCursor = images[MEDIA_BATCH - 1].id

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
