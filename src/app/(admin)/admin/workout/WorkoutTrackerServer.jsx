import { createClient } from '@/utils/supabase/server'
import WorkoutTrackerClient from './WorkoutTrackerClient'

export const revalidate = 0 // Revalidate on every request

const WorkoutTrackerServer = async () => {
  const supabase = createClient()

  const { data: exercises, error: exercisesError } = await supabase
    .from('exercises')
    .select('*')

  const { data: workouts, error: workoutsError } = await supabase
    .from('workouts')
    .select('*')

  if (exercisesError || workoutsError) {
    console.error('Error fetching data:', exercisesError || workoutsError)
    return <div>Error loading data</div>
  }

  return <WorkoutTrackerClient exercises={exercises} workouts={workouts} />
}

export default WorkoutTrackerServer

