'use client'
import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import ExerciseSearch from './ExerciseSearch'
import WorkoutSelector from './WorkoutSelector'
import AddExercise from './AddExercise'
import WorkoutExercisesList from './WorkoutExercisesList'
import { useToast } from '@/components/ui/use-toast'
import {
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'

const WorkoutTrackerClient = ({ exercises, workouts: initialWorkouts }) => {
  const supabase = createClient()
  const [user, setUser] = useState(null)
  const [newWorkoutName, setNewWorkoutName] = useState('')
  const [currentWorkout, setCurrentWorkout] = useState(null)
  const [workoutExercises, setWorkoutExercises] = useState([])
  const [workouts, setWorkouts] = useState(initialWorkouts)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()
  }, [])

  useEffect(() => {
    const fetchWorkoutExercises = async () => {
      if (currentWorkout) {
        const { data, error } = await supabase
          .from('workout_exercises')
          .select('*, exercise:exercises(*)')
          .eq('workout_id', currentWorkout.id)
          .order('order', { ascending: true })

        if (error) {
          console.error('Error fetching workout exercises:', error)
        } else {
          setWorkoutExercises(data)
        }
      }
    }

    fetchWorkoutExercises()
  }, [currentWorkout])

  const handleCreateWorkout = async () => {
    if (newWorkoutName && user) {
      const { data: insertData, error: insertError } = await supabase
        .from('workouts')
        .insert([
          {
            name: newWorkoutName,
            user_id: user.id,
          },
        ])
        .select('*')
        .single()

      if (insertError) {
        console.error('Error creating workout:', insertError)
        toast({
          variant: 'destructive',
          description: 'Failed to create workout. Please try again.',
        })
      } else {
        // Fetch the updated list of workouts
        const { data: workoutsData, error: workoutsError } = await supabase
          .from('workouts')
          .select('*')
          .order('created_at', { ascending: false })

        if (workoutsError) {
          console.error('Error fetching workouts:', workoutsError)
          toast({
            variant: 'destructive',
            description: 'Failed to fetch workouts. Please try again.',
          })
        } else {
          // Workout created successfully
          setNewWorkoutName('')
          setCurrentWorkout(insertData)
          setWorkoutExercises([])
          setWorkouts(workoutsData)
          toast({
            description: 'Workout created successfully.',
          })
        }
      }
    } else {
     
      // Handle the case when user is null or workout name is empty
      // ...
    }
  }

  const handleDeleteWorkout = async (workoutId) => {
    if (workoutId) {
      const { error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId)

      if (error) {
        console.error('Error deleting workout:', error)
        toast({
          variant: 'destructive',
          title: <ToastTitle>Error</ToastTitle>,
          description: (
            <ToastDescription>Failed to delete workout.</ToastDescription>
          ),
          action: <ToastClose />,
        })
      } else {
        setCurrentWorkout(null)
        setWorkoutExercises([])
        setWorkouts(workouts.filter((w) => w.id !== workoutId))
        toast({
          title: <ToastTitle>Success</ToastTitle>,
          description: (
            <ToastDescription>Workout deleted successfully.</ToastDescription>
          ),
          action: <ToastClose />,
        })
      }
    }
  }

  const handleUpdateWorkout = async (updatedWorkout) => {
    const { error } = await supabase
      .from('workouts')
      .update(updatedWorkout)
      .eq('id', updatedWorkout.id)

    if (error) {
      console.error('Error updating workout:', error)
      toast({
        variant: 'destructive',
        title: <ToastTitle>Error</ToastTitle>,
        description: (
          <ToastDescription>Failed to update workout.</ToastDescription>
        ),
        action: <ToastClose />,
      })
    } else {
      setCurrentWorkout(updatedWorkout)
      setWorkouts(
        workouts.map((w) => (w.id === updatedWorkout.id ? updatedWorkout : w)),
      )
      toast({
        title: <ToastTitle>Success</ToastTitle>,
        description: (
          <ToastDescription>Workout updated successfully.</ToastDescription>
        ),
        action: <ToastClose />,
      })
    }
  }

  return (
    <ToastProvider>
      <div className="container mx-auto max-w-6xl py-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Workout Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={newWorkoutName}
                    onChange={(e) => setNewWorkoutName(e.target.value)}
                    placeholder="New Workout Name"
                    className="rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Button onClick={handleCreateWorkout}>Create Workout</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Link href="/admin/workout/workout-session">
              <Button
                disabled={!currentWorkout || workoutExercises.length === 0}
              >
                Start Workout Session
              </Button>
            </Link>
          </div>
        </div>

        <WorkoutSelector
          workouts={workouts}
          currentWorkout={currentWorkout}
          setCurrentWorkout={(workout) => setCurrentWorkout(workout)}
          handleDeleteWorkout={handleDeleteWorkout}
          handleUpdateWorkout={handleUpdateWorkout}
        />

        <AddExercise
          exercises={exercises}
          currentWorkout={currentWorkout}
          workoutExercises={workoutExercises}
          setWorkoutExercises={setWorkoutExercises}
        />

        <WorkoutExercisesList
          workoutExercises={workoutExercises}
          setWorkoutExercises={setWorkoutExercises}
        />
      </div>
      <ToastViewport />
    </ToastProvider>
  )
}

export default WorkoutTrackerClient
