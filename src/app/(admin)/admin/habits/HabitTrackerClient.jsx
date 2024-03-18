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
import TimePicker from '@/components/ui/time-picker'
import { useToast } from '@/components/ui/use-toast'

const HabitTrackerClient = ({ initialHabits }) => {
  const [habits, setHabits] = useState(initialHabits)
  const [newHabit, setNewHabit] = useState('')
  const [dueFrequency, setDueFrequency] = useState('daily')
  const [dueTime, setDueTime] = useState(new Date())
  const [dueWeekdays, setDueWeekdays] = useState([])
  const [dueMonthDays, setDueMonthDays] = useState([])
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchHabits()
  }, [habits])

  const fetchHabits = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data, error } = await supabase
          .from('habits')
          .select('*')
          .eq('user_id', user.id)

        if (error) {
          console.error('Error fetching habits:', error)
          toast({
            variant: 'destructive',
            title: 'Error fetching habits',
            description: 'Please try again later.',
          })
        } else {
          setHabits(data || [])
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
            name: newHabit,
            completed: false,
            user_id: user.id,
            due_frequency: dueFrequency,
            due_time: dueTime.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            due_weekdays: dueWeekdays,
            due_month_days: dueMonthDays,
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
            setDueTime(new Date())
            setDueWeekdays([])
            setDueMonthDays([])
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

  const toggleHabit = async (habitId) => {
    try {
      const habit = habits.find((habit) => habit.id === habitId)
      const { data, error } = await supabase
        .from('habits')
        .update({ completed: !habit.completed })
        .eq('id', habitId)
      if (error) {
        console.error('Error updating habit:', error)
        toast({
          variant: 'destructive',
          title: 'Error updating habit',
          description: 'Please try again later.',
        })
      } else {
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
    } else if (habit.due_frequency === 'monthly') {
      return `On day(s) ${habit.due_month_days.join(', ')} of the month`
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
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <TimePicker value={dueTime} onChange={setDueTime} />
              <Button onClick={addHabit}>Add Habit</Button>
            </div>
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
            {dueFrequency === 'monthly' && (
              <div className="mt-4">
                <Label>Select Month Days</Label>
                <div className="mt-2 grid grid-cols-7 gap-2">
                  {Array.from({ length: 31 }, (_, i) => (
                    <div key={i + 1} className="flex items-center space-x-2">
                      <Checkbox
                        checked={dueMonthDays.includes(i + 1)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setDueMonthDays([...dueMonthDays, i + 1])
                          } else {
                            setDueMonthDays(
                              dueMonthDays.filter((d) => d !== i + 1),
                            )
                          }
                        }}
                      />
                      <Label className="text-sm">{i + 1}</Label>
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
                      {renderDueFrequency(habit)} •{' '}
                      {new Date(habit.due_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={habit.completed}
                      onCheckedChange={() => toggleHabit(habit.id)}
                    />
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
