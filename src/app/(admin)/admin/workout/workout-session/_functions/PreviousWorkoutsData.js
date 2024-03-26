import { createClient } from '@/utils/supabase/client'

const getPreviousWorkoutsData = async ({
  workoutExerciseId,
  setNumber,
  userId,
}) => {
  const supabase = createClient()

  try {
    const { data: workoutExercise, error: workoutExerciseError } =
      await supabase
        .from('workout_exercises')
        .select('workout_id, exercise_id')
        .eq('id', workoutExerciseId)
        .single()

    if (workoutExerciseError) {
      console.error('Error fetching workout exercise:', workoutExerciseError)
      return []
    }

    const { data: previousWorkouts, error: previousWorkoutsError } =
      await supabase
        .from('workout_sessions')
        .select('workout_id')
        .eq('user_id', userId)
        .lt('started_at', new Date().toISOString())
        .order('started_at', { ascending: false })
        .limit(2)

    if (previousWorkoutsError) {
      console.error('Error fetching previous workouts:', previousWorkoutsError)
      return []
    }

    const previousWorkoutIds = previousWorkouts.map(
      (workout) => workout.workout_id,
    )

    const { data: logs, error: logsError } = await supabase
      .from('workout_logs')
      .select('*')
      .in('workout_id', previousWorkoutIds)
      .eq('exercise_id', workoutExercise.exercise_id)
      .eq('set_number', setNumber)
      .order('started_at', { ascending: false })

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
