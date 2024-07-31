import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(_req: Request, { params }: { params: { mediaId: string } }) {
  try {
    const { mediaId } = params
    if (!mediaId)
      return new NextResponse('Media ID missing', { status: 422 })

    const media = await db.image.findFirst({
      where: {
        id: mediaId,
      },
    })

    return NextResponse.json({ resource: media }, { status: 200 })
  }
  catch (error) {
    console.log('[ERROR]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
