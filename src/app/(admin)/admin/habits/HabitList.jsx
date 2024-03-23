// HabitList.js
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { format, isToday, isTomorrow, isThisWeek, isDate } from 'date-fns'

const HabitList = () => {
  const [habits, setHabits] = useState([])
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
          .order('created_at', { ascending: true })

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

        fetchHabitsAndRecords()
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
        fetchHabitsAndRecords()
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
    <div className="mt-6 space-y-4">
      {habits.map((habit) => (
        <div key={habit.id} className="flex items-center justify-between">
          <div>
            <Label>{habit.name}</Label>
            <p className="text-sm text-gray-500">{renderDueFrequency(habit)}</p>
            {habit.reward && (
              <p className="text-sm text-gray-500">Reward: {habit.reward}</p>
            )}
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
                    <span key={record.id} className="text-sm text-gray-500">
                      {record.is_completed &&
                        `(Completed at ${format(
                          new Date(record.completed_at),
                          'MMM d, yyyy h:mm a',
                        )})`}
                    </span>
                  ))}
              </div>
            ))}
            <Button variant="ghost" onClick={() => deleteHabit(habit.id)}>
              x
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default HabitList
