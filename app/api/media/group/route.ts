import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { GroupMedia } from '@/next-env'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const groupBy = searchParams.get('groupBy')

    let groupMedia: unknown
    if (groupBy === 'year') {
      (groupMedia as GroupMedia<'year'>[]) = await db.$queryRaw`
        SELECT 
          year,
          json_agg(json_build_object('id', id, 'thumbUrl', thumb_url, 'createTime', create_time)) AS items 
        FROM (
          SELECT
            id,
            thumb_url,
            create_time,
            DATE_TRUNC('year', create_time) AS year,
            ROW_NUMBER() OVER (PARTITION BY DATE_TRUNC('year', create_time) ORDER BY create_time DESC) AS row_num
          FROM
            "Image"
        ) AS subquery
        WHERE row_num <= 3
        GROUP BY year
        ORDER BY year desc
      `
    }
    else {
      (groupMedia as GroupMedia<'month'>[]) = await db.$queryRaw`
        SELECT 
          month,
          json_agg(json_build_object('id', id, 'thumbUrl', thumb_url, 'createTime', create_time)) AS items 
        FROM (
          SELECT
            id,
            thumb_url,
            create_time,
            DATE_TRUNC('month', create_time) AS month,
            ROW_NUMBER() OVER (PARTITION BY DATE_TRUNC('month', create_time) ORDER BY create_time DESC) AS row_num
          FROM
            "Image"
        ) AS subquery
        WHERE row_num <= 3
        GROUP BY month
        ORDER BY month desc
      `
    }

    return NextResponse.json({ resource: groupMedia, status: 200 })
  }
  catch (error) {
    console.log('[ERROR]', error)
    return NextResponse.json({ error: 'Internal error', status: 500 })
  }
}
