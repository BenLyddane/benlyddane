'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import WorkoutSelector from './WorkoutSelector'
import ExerciseList from './ExerciseList'
import FinishWorkoutButton from './FinishWorkoutButton'
import RestTimer from './RestTimer'

const WorkoutSession = () => {
  const [workouts, setWorkouts] = useState([])
  const [exercises, setExercises] = useState([])
  const [workoutExercises, setWorkoutExercises] = useState([])
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null)
  const [currentWorkoutSession, setCurrentWorkoutSession] = useState(null)
  const [previousWorkoutLogs, setPreviousWorkoutLogs] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const { toast } = useToast()

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        console.error('User authentication error:', userError)
        toast({ title: 'User not authenticated', variant: 'destructive' })
        return
      }

      // Fetch workouts data
      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userData.user.id)
      if (workoutsError) {
        console.error('Error fetching workouts:', workoutsError)
        toast({
          title: 'Error fetching workouts',
          description: workoutsError.message,
          variant: 'destructive',
        })
      } else {
        setWorkouts(workoutsData)
      }

      // Fetch exercises data
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('*')
        .eq('user_id', userData.user.id)
      if (exercisesError) {
        console.error('Error fetching exercises:', exercisesError)
        toast({
          title: 'Error fetching exercises',
          description: exercisesError.message,
          variant: 'destructive',
        })
      } else {
        setExercises(exercisesData)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchWorkoutExercises = async (workoutId) => {
      if (!workoutId) return

      const { data: workoutExercisesData, error: workoutExercisesError } =
        await supabase
          .from('workout_exercises')
          .select('*, exercises(name)')
          .eq('workout_id', workoutId)

      if (workoutExercisesError) {
        console.error(
          'Error fetching workout exercises:',
          workoutExercisesError,
        )
        toast({
          title: 'Error fetching workout exercises',
          description: workoutExercisesError.message,
          variant: 'destructive',
        })
        return
      }

      setWorkoutExercises(workoutExercisesData)
    }

    fetchWorkoutExercises(selectedWorkoutId)
  }, [selectedWorkoutId, currentWorkoutSession, supabase, toast])

  useEffect(() => {
    const fetchPreviousWorkoutLogs = async () => {
      if (!selectedWorkoutId) return

      const { data: previousLogsData, error: previousLogsError } =
        await supabase
          .from('workout_logs')
          .select('*')
          .eq('workout_id', selectedWorkoutId)
          .order('started_at', { ascending: false })
          .limit(1)

      if (previousLogsError) {
        console.error(
          'Error fetching previous workout logs:',
          previousLogsError,
        )
        toast({
          title: 'Error fetching previous workout logs',
          description: previousLogsError.message,
          variant: 'destructive',
        })
        return
      }

      setPreviousWorkoutLogs(previousLogsData)
    }

    fetchPreviousWorkoutLogs()
  }, [selectedWorkoutId, supabase, toast])

  const startOrContinueWorkout = async () => {


    const { data: userData, error: userError } = await supabase.auth.getUser()


    if (userError || !userData.user) {

      toast({ title: 'User not authenticated', variant: 'destructive' })
      return
    }



    if (!selectedWorkoutId) {

      toast({ title: 'No workout selected', variant: 'destructive' })
      return
    }

    const { data: sessions, error: fetchError } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('workout_id', selectedWorkoutId)
      .is('completed_at', null)
   

    if (fetchError) {
    
      toast({
        title: 'Error fetching sessions',
        description: fetchError.message,
        variant: 'destructive',
      })
      return
    }

    if (sessions && sessions.length > 0) {

      setCurrentWorkoutSession(sessions[0])
      toast({ title: 'Continuing existing session', variant: 'success' })
    } else {
  

      const { data: createdSessions, error: creationError } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: userData.user.id,
          workout_id: selectedWorkoutId,
          started_at: new Date().toISOString(),
        })
        .select()
   

      if (creationError || !createdSessions || createdSessions.length === 0) {
      
        toast({
          title: 'Error creating session',
          description:
            creationError?.message || 'Unknown error creating session',
          variant: 'destructive',
        })
      } else {
       
        setCurrentWorkoutSession(createdSessions[0])
        toast({ title: 'New workout session started', variant: 'success' })
      }
    }
  }

  const finishWorkout = async () => {
    const { error } = await supabase
      .from('workout_sessions')
      .update({ completed_at: new Date().toISOString() })
      .eq('id', currentWorkoutSession.id)

    if (error) {
      console.error('Error completing workout session:', error)
      toast({
        title: 'Error completing workout session',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      setCurrentWorkoutSession(null)
      setSelectedWorkoutId(null)
      setWorkoutExercises([])
      toast({
        title: 'Workout completed',
        description: 'Great job! You finished your workout session.',
        variant: 'success',
      })
    }
  }

  const handleWorkoutSelectionChange = (value) => {
    setSelectedWorkoutId(value)
  }

  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="mb-4 text-3xl font-bold">Workout Session</h1>

      <Card>
        <CardHeader>
          <CardTitle className="mb-2 text-2xl font-bold">
            Select a Workout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <WorkoutSelector
            workouts={workouts}
            selectedWorkoutId={selectedWorkoutId}
            onWorkoutSelectionChange={handleWorkoutSelectionChange}
            onStartWorkout={startOrContinueWorkout}
            currentWorkoutSession={currentWorkoutSession}
          />
        </CardContent>
      </Card>

      {currentWorkoutSession && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="mb-2 text-2xl font-bold">
              {workouts.find((workout) => workout.id === selectedWorkoutId)
                ?.name || ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ExerciseList
              workoutExercises={workoutExercises}
              previousWorkoutLogs={previousWorkoutLogs}
              currentWorkoutSession={currentWorkoutSession}
              setTimeRemaining={setTimeRemaining}
              setWorkoutExercises={setWorkoutExercises}
            />
            <div className="mt-8 flex items-center justify-between">
              <FinishWorkoutButton onFinishWorkout={finishWorkout} />
              <RestTimer
                timeRemaining={timeRemaining}
                setTimeRemaining={setTimeRemaining}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default WorkoutSession



