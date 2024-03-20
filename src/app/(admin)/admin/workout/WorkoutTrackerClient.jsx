// WorkoutTrackerClient.jsx
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
      console.log('User is not authenticated or workout name is empty')
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

  const handleAddExercise = async (exercise) => {
    if (currentWorkout) {
      const { data, error } = await supabase
        .from('workout_exercises')
        .insert([exercise])
        .select('*, exercise:exercises(*)')
        .single()

      if (error) {
        console.error('Error adding exercise:', error)
        toast({
          variant: 'destructive',
          title: <ToastTitle>Error</ToastTitle>,
          description: (
            <ToastDescription>Failed to add exercise.</ToastDescription>
          ),
          action: <ToastClose />,
        })
      } else {
        setWorkoutExercises([...workoutExercises, data])
        toast({
          title: <ToastTitle>Success</ToastTitle>,
          description: (
            <ToastDescription>Exercise added successfully.</ToastDescription>
          ),
          action: <ToastClose />,
        })
      }
    }
  }

  const handleRemoveExercise = async (exerciseId) => {
    if (currentWorkout) {
      const { error } = await supabase
        .from('workout_exercises')
        .delete()
        .eq('id', exerciseId)

      if (error) {
        console.error('Error removing exercise:', error)
        toast({
          variant: 'destructive',
          title: <ToastTitle>Error</ToastTitle>,
          description: (
            <ToastDescription>Failed to remove exercise.</ToastDescription>
          ),
          action: <ToastClose />,
        })
      } else {
        setWorkoutExercises(workoutExercises.filter((e) => e.id !== exerciseId))
        toast({
          title: <ToastTitle>Success</ToastTitle>,
          description: (
            <ToastDescription>Exercise removed successfully.</ToastDescription>
          ),
          action: <ToastClose />,
        })
      }
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
                Start Workout
              </Button>
            </Link>
          </div>
        </div>

        <WorkoutSelector
          workouts={workouts}
          currentWorkout={currentWorkout}
          setCurrentWorkout={setCurrentWorkout}
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
