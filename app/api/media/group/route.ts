import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export interface GroupMedia {
  month: string
  items: {
    id: string
    thumbUrl: string
    createTime: string
  }[]
}
export async function GET(req: Request) {
  try {
    // const groupMediaByMonth = await db.$queryRaw`
    //   SELECT *
    //   FROM (
    //     SELECT
    //       id,
    //       thumb_url,
    //       create_time,
    //       DATE_TRUNC('month', create_time) AS month,
    //       ROW_NUMBER() OVER (PARTITION BY DATE_TRUNC('month', create_time) ORDER BY create_time) AS row_num
    //     FROM
    //       "images"
    //   ) AS subquery
    //   WHERE row_num <= 3
    //   ORDER BY month, create_time;
    // `
    const groupMediaByMonth: GroupMedia[] = await db.$queryRaw`
      SELECT 
        month,
        json_agg(json_build_object('id', id, 'thumbUrl', thumb_url, 'createTime', create_time)) AS items 
      FROM (
        SELECT
          id,
          thumb_url,
          create_time,
          DATE_TRUNC('month', create_time) AS month
        FROM
          "Image"
      ) AS subquery
      GROUP BY month
      ORDER BY month desc
    `
    return NextResponse.json({ resource: groupMediaByMonth, status: 200 })
  }
  catch (error) {
    console.log('[ERROR]', error)
    return NextResponse.json({ error: 'Internal error', status: 500 })
  }
}
