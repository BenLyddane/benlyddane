'use client'

import { useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'

const TimePicker = ({ value, onChange }) => {
  const [hours, setHours] = useState(value.getHours())
  const [minutes, setMinutes] = useState(value.getMinutes())

  const handleChange = (newHours, newMinutes) => {
    const newDate = new Date(value)
    newDate.setHours(newHours)
    newDate.setMinutes(newMinutes)
    onChange(newDate)
  }

  const formatTime = (time) => {
    return time.toString().padStart(2, '0')
  }

  return (
    <div className="flex items-center space-x-2">
      <Select
        value={hours}
        onValueChange={(newHours) => {
          setHours(Number(newHours))
          handleChange(Number(newHours), minutes)
        }}
      >
        <SelectTrigger className="w-20">
          <SelectValue placeholder="Hour" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 24 }, (_, i) => (
            <SelectItem key={i} value={i}>
              {formatTime(i)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="font-bold">:</span>
      <Select
        value={minutes}
        onValueChange={(newMinutes) => {
          setMinutes(Number(newMinutes))
          handleChange(hours, Number(newMinutes))
        }}
      >
        <SelectTrigger className="w-20">
          <SelectValue placeholder="Minute" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 60 }, (_, i) => (
            <SelectItem key={i} value={i}>
              {formatTime(i)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default TimePicker
