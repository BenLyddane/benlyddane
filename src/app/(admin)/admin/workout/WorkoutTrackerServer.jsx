import { createClient } from '@/utils/supabase/server'
import WorkoutTrackerClient from './WorkoutTrackerClient'

export const revalidate = 0 // Revalidate on every request

const fetchExercisesAndWorkouts = async () => {
  const supabase = createClient()
  const exercisesData = await supabase.from('exercises').select()
  const workoutsData = await supabase.from('workouts').select()

  return {
    exercises: exercisesData.data,
    workouts: workoutsData.data,
  }
}

export const createWorkout = async (workoutName, userId) => {
  const supabase = createClient()

  const { data, error } = await supabase.from('workouts').insert([
    {
      name: workoutName,
      user_id: userId,
    },
  ])
  if (!error && data.length > 0) {
    return data[0]
  } else {
    console.error('Error creating workout:', error)
  }
}

export const addExercise = async (exercise) => {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('workout_exercises')
    .insert([exercise])
  if (!error && data) {
    return data[0]
  } else {
    console.error('Error adding exercise:', error)
  }
}

export const deleteExercise = async (exerciseId) => {
  const supabase = createClient()
  const { error } = await supabase
    .from('workout_exercises')
    .delete()
    .eq('id', exerciseId)
  if (!error) {
    return true
  } else {
    console.error('Error deleting exercise:', error)
    return false
  }
}

const WorkoutTrackerServer = ({ exercises, workouts }) => {
  return <WorkoutTrackerClient exercises={exercises} workouts={workouts} />
}

export async function getServerSideProps() {
  const { exercises, workouts } = await fetchExercisesAndWorkouts()

  return {
    props: {
      exercises,
      workouts,
    },
  }
}

export default WorkoutTrackerServer
