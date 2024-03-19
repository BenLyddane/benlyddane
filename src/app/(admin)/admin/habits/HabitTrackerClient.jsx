'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { format, isToday, isTomorrow, isThisWeek, isDate } from 'date-fns'
import TimePicker from '@/components/ui/time-picker'
import { Toggle } from '@/components/ui/toggle'

const HabitTrackerClient = () => {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')
  const [dueFrequency, setDueFrequency] = useState('daily')
  const [dueTimes, setDueTimes] = useState([new Date(0, 0, 0, 8, 0)])
  const [dueWeekdays, setDueWeekdays] = useState([])
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchHabitsAndRecords()
  }, [])

  const fetchHabitsAndRecords = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: habitsData, error: habitsError } = await supabase
          .from('habits')
          .select('*, habit_records(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true }) // Order habits by creation time

        if (habitsError) {
          console.error('Error fetching habits:', habitsError)
          toast({
            variant: 'destructive',
            title: 'Error fetching habits',
            description: 'Please try again later.',
          })
        } else {
          setHabits(habitsData || [])
        }
      }
    } catch (error) {
      console.error('Error fetching habits:', error)
      toast({
        variant: 'destructive',
        title: 'Error fetching habits',
        description: 'Please try again later.',
      })
    }
  }

  const addHabit = async () => {
    if (newHabit.trim() !== '') {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data, error } = await supabase.from('habits').insert({
            user_id: user.id,
            name: newHabit,
            due_frequency: dueFrequency,
            due_times: dueTimes.map((time) => format(time, 'HH:mm')),
            due_weekdays: dueWeekdays,
            completed_times: Array(dueTimes.length).fill(false),
          })

          if (error) {
            console.error('Error adding habit:', error)
            toast({
              variant: 'destructive',
              title: 'Error adding habit',
              description: 'Please try again later.',
            })
          } else {
            setNewHabit('')
            setDueFrequency('daily')
            setDueTimes([new Date(0, 0, 0, 8, 0)])
            setDueWeekdays([])
            fetchHabitsAndRecords() // Fetch updated habits and records
            toast({
              title: 'Habit added successfully',
            })
          }
        }
      } catch (error) {
        console.error('Error adding habit:', error)
        toast({
          variant: 'destructive',
          title: 'Error adding habit',
          description: 'Please try again later.',
        })
      }
    }
  }

  const toggleHabit = async (habitId, timeIndex) => {
    try {
      const habit = habits.find((habit) => habit.id === habitId)
      const dueTime = habit.due_times[timeIndex]
      const completedTimes = [...(habit.completed_times || [])]
      const isCompleted = !completedTimes[timeIndex]
      completedTimes[timeIndex] = isCompleted

      const { error: updateError } = await supabase
        .from('habits')
        .update({ completed_times: completedTimes })
        .eq('id', habitId)

      if (updateError) {
        console.error('Error updating habit:', updateError)
        toast({
          variant: 'destructive',
          title: 'Error updating habit',
          description: 'Please try again later.',
        })
      } else {
        const currentDate = new Date()
        const existingRecord = await supabase
          .from('habit_records')
          .select('id')
          .eq('habit_id', habitId)
          .eq('due_time', dueTime)
          .single()

        if (existingRecord.data) {
          const { error: recordUpdateError } = await supabase
            .from('habit_records')
            .update({
              is_completed: isCompleted,
              completed_at: isCompleted ? currentDate : null,
            })
            .eq('id', existingRecord.data.id)

          if (recordUpdateError) {
            console.error('Error updating habit record:', recordUpdateError)
            toast({
              variant: 'destructive',
              title: 'Error updating habit record',
              description: 'Please try again later.',
            })
          }
        } else {
          const { error: recordInsertError } = await supabase
            .from('habit_records')
            .insert({
              habit_id: habitId,
              due_time: dueTime,
              is_completed: isCompleted,
              completed_at: isCompleted ? currentDate : null,
            })

          if (recordInsertError) {
            console.error('Error inserting habit record:', recordInsertError)
            toast({
              variant: 'destructive',
              title: 'Error inserting habit record',
              description: 'Please try again later.',
            })
          }
        }

        fetchHabitsAndRecords() // Fetch updated habits and records
        toast({
          title: 'Habit updated successfully',
        })
      }
    } catch (error) {
      console.error('Error updating habit:', error)
      toast({
        variant: 'destructive',
        title: 'Error updating habit',
        description: 'Please try again later.',
      })
    }
  }

  const deleteHabit = async (habitId) => {
    try {
      const { error } = await supabase.from('habits').delete().eq('id', habitId)

      if (error) {
        console.error('Error deleting habit:', error)
        toast({
          variant: 'destructive',
          title: 'Error deleting habit',
          description: 'Please try again later.',
        })
      } else {
        fetchHabitsAndRecords() // Fetch updated habits and records
        toast({
          title: 'Habit deleted successfully',
        })
      }
    } catch (error) {
      console.error('Error deleting habit:', error)
      toast({
        variant: 'destructive',
        title: 'Error deleting habit',
        description: 'Please try again later.',
      })
    }
  }

  const renderDueFrequency = (habit) => {
    if (habit.due_frequency === 'daily') {
      return 'Daily'
    } else if (habit.due_frequency === 'weekly') {
      return `Every ${habit.due_weekdays
        .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
        .join(', ')}`
    }
  }

  const renderCompletionStatus = (habit, timeIndex) => {
    const dueTime = habit.due_times[timeIndex]
    const isCompleted = habit.completed_times[timeIndex]
    const currentDate = new Date()
    const dueDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      parseInt(dueTime.split(':')[0], 10),
      parseInt(dueTime.split(':')[1], 10),
    )

    if (isCompleted) {
      return 'Completed'
    } else if (isToday(dueDate)) {
      return 'Due Today'
    } else if (isTomorrow(dueDate)) {
      return 'Due Tomorrow'
    } else if (isThisWeek(dueDate)) {
      return 'Due This Week'
    } else {
      return isDate(dueDate)
        ? `Due on ${format(dueDate, 'MMM d')}`
        : 'Due Date Unavailable'
    }
  }

  return (
    <div className="flex justify-center pt-12">
      <div className="w-full max-w-6xl">
        <Card>
          <CardHeader>
            <h2 className="text-center text-2xl font-bold">Habit Tracker</h2>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Enter a new habit"
                className="flex"
              />
              <Select
                onValueChange={setDueFrequency}
                defaultValue="daily"
                className="w-40"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() =>
                  setDueTimes([...dueTimes, new Date(0, 0, 0, 8, 0)])
                }
              >
                Add Time
              </Button>
              <Button onClick={addHabit}>Add Habit</Button>
            </div>
            {dueTimes.map((time, index) => (
              <div key={index} className="mt-4 flex items-center space-x-4">
                <TimePicker
                  value={time}
                  onChange={(newTime) => {
                    const newTimes = [...dueTimes]
                    newTimes[index] = newTime
                    setDueTimes(newTimes)
                  }}
                />
                <Toggle
                  pressed={time.getHours() < 12}
                  onPressedChange={(isAM) => {
                    const newTimes = [...dueTimes]
                    const hours = isAM ? time.getHours() : time.getHours() + 12
                    newTimes[index] = new Date(time.setHours(hours))
                    setDueTimes(newTimes)
                  }}
                  className="data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                >
                  {time.getHours() < 12 ? 'AM' : 'PM'}
                </Toggle>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const newTimes = [...dueTimes]
                    newTimes.splice(index, 1)
                    setDueTimes(newTimes)
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            {dueFrequency === 'weekly' && (
              <div className="mt-4">
                <Label>Select Weekdays</Label>
                <div className="mt-2 flex space-x-4">
                  {[
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ].map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        checked={dueWeekdays.includes(day.toLowerCase())}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setDueWeekdays([...dueWeekdays, day.toLowerCase()])
                          } else {
                            setDueWeekdays(
                              dueWeekdays.filter(
                                (d) => d !== day.toLowerCase(),
                              ),
                            )
                          }
                        }}
                      />
                      <Label className="text-sm">{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 space-y-4">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <Label>{habit.name}</Label>
                    <p className="text-sm text-gray-500">
                      {renderDueFrequency(habit)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {habit.due_times.map((time, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox
                          checked={
                            habit.completed_times &&
                            habit.completed_times.length > index &&
                            habit.completed_times[index]
                          }
                          onCheckedChange={() => toggleHabit(habit.id, index)}
                        />
                        <Label className="text-sm">
                          {time} - {renderCompletionStatus(habit, index)}
                        </Label>
                        {habit.habit_records
                          ?.filter((record) => record.due_time === time)
                          .map((record) => (
                            <span
                              key={record.id}
                              className="text-sm text-gray-500"
                            >
                              {record.is_completed &&
                                `(Completed at ${format(
                                  new Date(record.completed_at),
                                  'MMM d, yyyy h:mm a',
                                )})`}
                            </span>
                          ))}
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      onClick={() => deleteHabit(habit.id)}
                    >
                      x
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-gray-500">
              Track your habits!
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default HabitTrackerClient
