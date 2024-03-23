// PreviousWorkoutsData.jsx
'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

const PreviousWorkoutsData = ({ workoutExerciseId, setNumber, userId }) => {
  const [previousWorkoutsLogs, setPreviousWorkoutsLogs] = useState([])
  const supabase = createClient()

  useEffect(() => {
    const fetchPreviousWorkoutsLogs = async () => {
      const { data: workoutExercise, error: workoutExerciseError } =
        await supabase
          .from('workout_exercises')
          .select('workout_id, exercise_id')
          .eq('id', workoutExerciseId)
          .single()

      if (workoutExerciseError) {
        console.error('Error fetching workout exercise:', workoutExerciseError)
        return
      }

      const { data: previousWorkouts, error: previousWorkoutsError } =
        await supabase
          .from('workouts')
          .select('id')
          .eq('user_id', userId)
          .lt('created_at', new Date().toISOString())
          .order('created_at', { ascending: false })
          .limit(2)

      if (previousWorkoutsError) {
        console.error(
          'Error fetching previous workouts:',
          previousWorkoutsError,
        )
        return
      }

      const previousWorkoutIds = previousWorkouts.map((workout) => workout.id)

      const { data: logs, error: logsError } = await supabase
        .from('workout_logs')
        .select('*')
        .in('workout_id', previousWorkoutIds)
        .eq('exercise_id', workoutExercise.exercise_id)
        .eq('set_number', setNumber)
        .order('started_at', { ascending: false })

      if (logsError) {
        console.error('Error fetching previous workouts logs:', logsError)
        return
      }

      setPreviousWorkoutsLogs(logs)
    }

    fetchPreviousWorkoutsLogs()
  }, [workoutExerciseId, setNumber, userId, supabase])

  return previousWorkoutsLogs
}

export default PreviousWorkoutsData
