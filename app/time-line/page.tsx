import React from 'react'
import { db } from '@/lib/db'
import { TimeLineItem } from '@/components/time-line-item'

export interface GroupMedia {
  month: Date
  items: {
    id: string
    thumbUrl: string
    createTime: string
  }[]
}

interface Props { }
const TimeLinePage: React.FC<Props> = async () => {
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
        "images"
    ) AS subquery
    GROUP BY month
    ORDER BY month desc
  `
  return (
    <div>
      {groupMediaByMonth.length === 0
        ? (<h3>暂无数据</h3>)
        : groupMediaByMonth.map(group => (
          <TimeLineItem key={group.month.getTime()} group={group} />
        ),
        )}
    </div>
  )
}
export default TimeLinePage
