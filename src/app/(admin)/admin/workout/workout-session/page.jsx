'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import WorkoutSelector from './WorkoutSelector'
import SessionExerciseList from './SessionExerciseList'
import FinishWorkoutButton from './FinishWorkoutButton'

const WorkoutSession = () => {
  const [workouts, setWorkouts] = useState([])
  const [workoutExercises, setWorkoutExercises] = useState([])
  const [exercises, setExercises] = useState([])
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null)
  const [currentWorkoutSession, setCurrentWorkoutSession] = useState(null)
  const [previousWorkoutLogs, setPreviousWorkoutLogs] = useState([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const { toast } = useToast()

  const supabase = createClient()

  useEffect(() => {
    const fetchInitialData = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData.user) {
        console.error('User authentication error:', userError)
        toast({ title: 'User not authenticated', variant: 'destructive' })
        return
      }

      await fetchWorkouts(userData.user.id)
      await fetchExercises(userData.user.id)
      await fetchCurrentWorkoutSession(userData.user.id)
    }

    fetchInitialData()
  }, [])

  useEffect(() => {
    if (selectedWorkoutId) {
      fetchWorkoutExercises(selectedWorkoutId)
      fetchPreviousWorkoutLogs(selectedWorkoutId)
    }
  }, [selectedWorkoutId, currentWorkoutSession])

  const fetchData = async (table, column, value, setState) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq(column, value)

    if (error) {
      console.error(`Error fetching ${table}:`, error)
      toast({
        title: `Error fetching ${table}`,
        description: error.message,
        variant: 'destructive',
      })
    } else {
      setState(data)
    }
  }

  const fetchWorkouts = async (userId) => {
    await fetchData('workouts', 'user_id', userId, setWorkouts)
  }

  const fetchExercises = async (userId) => {
    await fetchData('exercises', 'user_id', userId, setExercises)
  }

  const fetchCurrentWorkoutSession = async (userId) => {
    const { data: sessionData, error: sessionError } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .is('completed_at', null)
      .single()

    if (sessionError) {
      if (sessionError.code !== 'PGRST116') {
        console.error('Error fetching current workout session:', sessionError)
        toast({
          title: 'Error fetching current workout session',
          description: sessionError.message,
          variant: 'destructive',
        })
      }
    } else {
      setCurrentWorkoutSession(sessionData)
      setSelectedWorkoutId(sessionData?.workout_id || null)

      if (sessionData) {
        toast({
          title: 'Continuing Existing Workout Session',
          variant: 'success',
        })
      }
    }
  }

  const fetchWorkoutExercises = async (workoutId) => {
    await fetchData(
      'workout_exercises',
      'workout_id',
      workoutId,
      setWorkoutExercises,
    )
  }

  const fetchPreviousWorkoutLogs = async (workoutId) => {
    await fetchData(
      'workout_logs',
      'workout_id',
      workoutId,
      setPreviousWorkoutLogs,
    )
  }

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

    if (currentWorkoutSession) {
      toast({ title: 'Continuing existing session', variant: 'success' })
      return
    }

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
        description: creationError?.message || 'Unknown error creating session',
        variant: 'destructive',
      })
    } else {
      setCurrentWorkoutSession(createdSessions[0])
      toast({ title: 'New workout session started', variant: 'success' })
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

  const updateWorkoutExercises = (updatedExerciseId, updatedData) => {
    setWorkoutExercises((prevExercises) =>
      prevExercises.map((exercise) =>
        exercise.id === updatedExerciseId
          ? { ...exercise, ...updatedData }
          : exercise,
      ),
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Workout Session</h1>
      {!currentWorkoutSession && (
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
      )}
      {currentWorkoutSession && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="mb-2 text-2xl font-bold">
              {workouts.find((workout) => workout.id === selectedWorkoutId)
                ?.name || ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SessionExerciseList
              workoutExercises={workoutExercises}
              previousWorkoutLogs={previousWorkoutLogs}
              currentWorkoutSession={currentWorkoutSession}
              setTimeRemaining={setTimeRemaining}
              updateWorkoutExercises={updateWorkoutExercises}
            />
            <div className="mt-8 flex flex-col items-center justify-between sm:flex-row">
              <FinishWorkoutButton onFinishWorkout={finishWorkout} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default WorkoutSession
