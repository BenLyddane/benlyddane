'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import WorkoutSession from './workoutSession'

const Page = () => {
  const supabase = createClient()
  const [workouts, setWorkouts] = useState([])
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null)
  const [currentWorkout, setCurrentWorkout] = useState(null)
  const [workoutExercises, setWorkoutExercises] = useState([])

  useEffect(() => {
    const fetchWorkouts = async () => {
      const user = supabase.auth.user()

      if (user) {
        const { data, error } = await supabase
          .from('workouts')
          .select('*')
          .eq('user_id', user.id)

        if (!error) {
          setWorkouts(data)
        } else {
          console.error('Error fetching workouts:', error)
        }
      } else {
        console.error('User not logged in')
      }
    }

    fetchWorkouts()
  }, [])

  useEffect(() => {
    const fetchSelectedWorkout = async () => {
      if (selectedWorkoutId) {
        const { data, error } = await supabase
          .from('workouts')
          .select('*, workout_exercises(*)')
          .eq('id', selectedWorkoutId)
          .single()

        if (!error && data) {
          setCurrentWorkout(data)
          setWorkoutExercises(data.workout_exercises)
        } else {
          console.error('Error fetching selected workout:', error)
        }
      }
    }

    fetchSelectedWorkout()
  }, [selectedWorkoutId])

  const handleCompleteWorkout = () => {
    setCurrentWorkout(null)
    setWorkoutExercises([])
  }

  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="w-full max-w-6xl">
        <select
          className="mb-4 w-full rounded border border-gray-300 p-2"
          value={selectedWorkoutId}
          onChange={(e) => setSelectedWorkoutId(e.target.value)}
        >
          <option value="">Select a Workout</option>
          {workouts.map((workout) => (
            <option key={workout.id} value={workout.id}>
              {workout.name}
            </option>
          ))}
        </select>
      </div>

      {currentWorkout && (
        <div className="w-full max-w-6xl">
          <WorkoutSession
            currentWorkout={currentWorkout}
            workoutExercises={workoutExercises}
            onCompleteWorkout={handleCompleteWorkout}
          />
        </div>
      )}
    </div>
  )
}

export default Page
