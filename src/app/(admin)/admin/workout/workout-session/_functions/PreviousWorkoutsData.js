import { createClient } from '@/utils/supabase/client'

const getPreviousWorkoutsData = async ({ workoutExerciseId, setNumber, userId, excludeWorkoutSessionId }) => {
  const supabase = createClient()
  try {
    const { data: workoutExercise, error: workoutExerciseError } = await supabase
      .from('workout_exercises')
      .select('workout_id, exercise_id')
      .eq('id', workoutExerciseId)
      .single()

    if (workoutExerciseError) {
      console.error('Error fetching workout exercise:', workoutExerciseError)
      return []
    }

    const { data: logs, error: logsError } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('exercise_id', workoutExercise.exercise_id)
      .eq('set_number', setNumber)
      .eq('user_id', userId)
      .neq('workout_session_id', excludeWorkoutSessionId) // Exclude the current workout session
      .order('completed_at', { ascending: false })
      .limit(2)

    if (logsError) {
      console.error('Error fetching previous workouts logs:', logsError)
      return []
    }

    return logs
  } catch (error) {
    console.error('Error in getPreviousWorkoutsData:', error)
    return []
  }
}

export default getPreviousWorkoutsData