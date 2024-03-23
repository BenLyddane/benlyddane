// HabitTrackerClient.js
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import HabitForm from './HabitForm'
import HabitList from './HabitList'

const HabitTrackerClient = () => {
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

  const addHabit = async (habitData) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data, error } = await supabase.from('habits').insert({
          user_id: user.id,
          name: habitData.name,
          due_frequency: habitData.due_frequency,
          due_times: habitData.due_times,
          due_weekdays: habitData.due_weekdays,
          reward: habitData.reward,
          completed_times: Array(habitData.due_times.length).fill(false),
        })

        if (error) {
          console.error('Error adding habit:', error)
          toast({
            variant: 'destructive',
            title: 'Error adding habit',
            description: 'Please try again later.',
          })
        } else {
          fetchHabitsAndRecords()
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

  return (
    <div className="flex justify-center pt-12">
      <div className="w-full max-w-6xl">
        <Card>
          <CardHeader>
            <h2 className="text-center text-2xl font-bold">Habit Tracker</h2>
          </CardHeader>
          <CardContent>
            <HabitForm onSubmit={addHabit} />
            <HabitList habits={habits} onHabitUpdate={fetchHabitsAndRecords} />
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
