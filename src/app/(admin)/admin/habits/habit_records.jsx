'use client'
import React, { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { CalendarColor } from '@/components/ui/calendar-color'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/utils/supabase/client'

const HabitCompletionGraph = () => {
  const supabase = createClient()
  const [habits, setHabits] = useState([])
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('week')

  useEffect(() => {
    const fetchHabitData = async () => {
      try {
        const { data, error } = await supabase
          .from('habits')
          .select('*, habit_records(completed_at, is_completed)')

        if (error) {
          console.error('Error fetching habit data:', error)
        } else {
          setHabits(data)
        }
      } catch (error) {
        console.error('Error fetching habit data:', error)
      }
    }

    fetchHabitData()
  }, [supabase])

  useEffect(() => {
    const fetchHabitRecords = async () => {
      try {
        const { data, error } = await supabase
          .from('habit_records')
          .select('*')
          .gte('completed_at', getTimeFrameStartDate(selectedTimeFrame))

        if (error) {
          console.error('Error fetching habit records:', error)
        } else {
          const updatedHabits = habits.map((habit) => ({
            ...habit,
            habit_records: data.filter(
              (record) => record.habit_id === habit.id,
            ),
          }))
          setHabits(updatedHabits)
        }
      } catch (error) {
        console.error('Error fetching habit records:', error)
      }
    }

    fetchHabitRecords()
  }, [habits, selectedTimeFrame, supabase])

  const getTimeFrameStartDate = (timeFrame) => {
    const now = new Date()
    if (timeFrame === 'week') {
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    } else if (timeFrame === 'month') {
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    } else if (timeFrame === 'year') {
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    } else {
      return new Date(0)
    }
  }

  const handleTimeFrameChange = (value) => {
    setSelectedTimeFrame(value)
  }

  const renderDay = (date, habit) => {
    const isCurrentDay = date.toDateString() === new Date().toDateString()
    const isPastDay = date < new Date()

    const dueTimes = habit.due_times || []
    const completedRecords = habit.habit_records.filter(
      (record) =>
        record.is_completed &&
        new Date(record.completed_at).toDateString() === date.toDateString(),
    )

    const incompleteRecords = habit.habit_records.filter(
      (record) =>
        !record.is_completed &&
        new Date(record.completed_at).toDateString() === date.toDateString(),
    )

    let colorClass = ''

    if (isCurrentDay) {
      colorClass =
        completedRecords.length === dueTimes.length
          ? 'bg-green-500 text-white'
          : 'bg-yellow-500 text-white'
    } else if (isPastDay) {
      if (incompleteRecords.length > 0) {
        colorClass = 'bg-red-500 text-white'
      } else if (completedRecords.length === dueTimes.length) {
        colorClass = 'bg-green-500 text-white'
      } else {
        colorClass = 'bg-muted text-muted-foreground'
      }
    } else {
      colorClass = 'bg-muted text-muted-foreground'
    }

    return (
      <div className={`day ${colorClass}`}>
        <span className="day-number">{date.getDate()}</span>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="font-medium">
                {selectedTimeFrame === 'week'
                  ? 'Past Week'
                  : selectedTimeFrame === 'month'
                    ? 'Past Month'
                    : selectedTimeFrame === 'year'
                      ? 'Past Year'
                      : 'All Time'}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => handleTimeFrameChange('week')}>
                Past Week
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleTimeFrameChange('month')}>
                Past Month
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleTimeFrameChange('year')}>
                Past Year
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleTimeFrameChange('allTime')}
              >
                All Time
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Accordion type="single" collapsible>
          {habits.map((habit) => {
            const completedRecords = habit.habit_records.filter(
              (record) => record.is_completed,
            )
            const incompleteRecords = habit.habit_records.filter(
              (record) => !record.is_completed,
            )

            const calendarEvents = habit.habit_records.reduce(
              (events, record) => {
                const date = new Date(record.completed_at)
                const dateString = date.toDateString()

                if (!events[dateString]) {
                  events[dateString] = {
                    start: date,
                    end: date,
                    completedRecords: 0,
                    totalRecords: 0,
                  }
                }

                events[dateString].totalRecords++

                if (record.is_completed) {
                  events[dateString].completedRecords++
                }

                return events
              },
              {},
            )

            return (
              <AccordionItem key={habit.id} value={habit.id}>
                <AccordionTrigger>
                  <Card className="w-full">
                    <CardHeader>
                      <CardTitle>{habit.name}</CardTitle>
                      <Badge variant="outline">
                        {completedRecords.length} Completed /{' '}
                        {incompleteRecords.length} Incomplete
                      </Badge>
                    </CardHeader>
                  </Card>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent>
                    <CalendarColor
                      initialView="month"
                      selectionMode="none"
                      initialFocus
                      showWeekNumbers
                      className="h-96 w-full"
                      mode="interactive"
                      events={Object.values(calendarEvents)}
                      renderDay={(date) => renderDay(date, habit)}
                    />
                  </CardContent>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </div>
  )
}

export default HabitCompletionGraph
