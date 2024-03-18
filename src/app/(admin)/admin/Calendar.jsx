'use client'
import React from 'react'
import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'

export function AdminCalendar() {
  const [date, setDate] = React.useState(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md shadow"
    />
  )
}
