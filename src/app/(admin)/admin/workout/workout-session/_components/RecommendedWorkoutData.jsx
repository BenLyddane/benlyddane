'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useEffect } from 'react'

const RecommendedWorkoutData = ({ workoutExerciseId, setNumber, userId }) => {
  const [recommendedData, setRecommendedData] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchRecommendedData = async () => {
      // Fetch the workout logs for the last 4 workouts
      const { data: logs, error: logsError } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('exercise_id', workoutExerciseId)
        .eq('set_number', setNumber)
        .order('started_at', { ascending: false })
        .limit(4)

      if (logsError) {
        console.error('Error fetching workout logs:', logsError)
        return
      }

      // If there are no previous logs, don't show recommendations
      if (logs.length === 0) {
        setRecommendedData(null)
        return
      }

      // Get the first set data from the previous workout log
      const prevFirstSet = logs[0]

      // Determine the recommended values based on the first set data and the principles of volume autoregulation
      let recommendedReps = prevFirstSet.reps_completed
      let recommendedWeight = prevFirstSet.weight_completed
      let recommendedRPE = prevFirstSet.rpe
      let recommendedSetChange = 0

      // If there is only one previous log, provide a conservative recommendation
      if (logs.length === 1) {
        recommendedReps = prevFirstSet.reps_completed
        recommendedWeight = prevFirstSet.weight_completed
        recommendedRPE = prevFirstSet.rpe
        recommendedSetChange = 0
      }
      // If there are multiple previous logs, adjust the recommendations based on the first set data
      else {
        // If the athlete recovered easily and ahead of schedule (low RPE and high performance)
        if (
          prevFirstSet.rpe <= 6 &&
          prevFirstSet.reps_completed >= recommendedReps
        ) {
          recommendedSetChange = 1 // Recommend adding a set
          recommendedReps += 1 // Increase reps by 1
          recommendedWeight = Math.ceil((recommendedWeight * 1.05) / 2.5) * 2.5 // Increase weight by 5%, rounded up to nearest 2.5 lbs
          recommendedRPE = Math.min(recommendedRPE + 1, 9) // Increase RPE by 1, max 9
        }
        // If the athlete is getting way too beat up to recover on time (high RPE and low performance)
        else if (
          prevFirstSet.rpe >= 9 &&
          prevFirstSet.reps_completed <= recommendedReps
        ) {
          recommendedSetChange = -1 // Recommend subtracting a set
          recommendedReps = Math.max(recommendedReps - 2, 1) // Decrease reps by 2, minimum 1
          recommendedWeight = Math.ceil((recommendedWeight * 0.95) / 5) * 5 // Decrease weight by 5%, rounded up to nearest 5 lbs
          recommendedRPE = Math.max(recommendedRPE - 1, 6) // Decrease RPE by 1, minimum 6
        }
      }

      setRecommendedData({
        reps: recommendedReps,
        weight: recommendedWeight,
        rpe: recommendedRPE,
        setChange: recommendedSetChange,
      })
    }

    fetchRecommendedData()
  }, [workoutExerciseId, setNumber, userId, supabase])

  return recommendedData
}

export default RecommendedWorkoutData
