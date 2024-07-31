'use client'
import React from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import type { GroupBy } from '@/next-env'

interface Props {
  groupBy: GroupBy
  setGroupBy: (g: GroupBy) => void
}
export const GroupRadio: React.FC<Props> = ({groupBy, setGroupBy}) => {
  return (
    <RadioGroup
      className="flex flex-row justify-around bg-pink-100 p-1 mb-1 rounded-md text-zinc-500"
      value={groupBy}
      onValueChange={setGroupBy}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="year" id="r1" />
        <Label htmlFor="r1">年</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="month" id="r2" />
        <Label htmlFor="r2">月</Label>
      </div>
    </RadioGroup>
  )
}
