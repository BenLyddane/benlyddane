'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'

const WorkoutSession = () => {
  const [workouts, setWorkouts] = useState([])
  const [exercises, setExercises] = useState([])
  const [workoutExercises, setWorkoutExercises] = useState([])
  const [selectedWorkoutId, setSelectedWorkoutId] = useState(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [currentSet, setCurrentSet] = useState(1)
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [rpe, setRpe] = useState('')
  const [timerDuration, setTimerDuration] = useState(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [currentWorkoutSession, setCurrentWorkoutSession] = useState(null)
  const { toast } = useToast()

  const supabase = createClient()

  const fetchWorkoutExercises = async (workoutId) => {
    if (!workoutId) return

    const { data, error } = await supabase
      .from('workout_exercises')
      .select('*, exercises(name)')
      .eq('workout_id', workoutId)

    if (error) {
      console.error('Error fetching workout exercises:', error)
      toast({
        title: 'Error fetching workout exercises',
        description: error.message,
        variant: 'destructive',
      })
      return
    }

    setWorkoutExercises(data)
  }

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
          .select(
            `
          *,
          exercises:name (
            name
          )
        `,
          )
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

    fetchWorkoutExercises()
  }, [selectedWorkoutId, currentWorkoutSession, supabase, toast])

  const startOrContinueWorkout = async () => {
    console.log('Start Workout button clicked.')

    const { data: userData, error: userError } = await supabase.auth.getUser()
    console.log('Auth attempt:', { userData, userError })

    if (userError || !userData.user) {
      console.log('User authentication failed:', userError)
      toast({ title: 'User not authenticated', variant: 'destructive' })
      return
    }

    console.log('Authenticated user ID:', userData.user.id)

    if (!selectedWorkoutId) {
      console.log('No workout selected.')
      toast({ title: 'No workout selected', variant: 'destructive' })
      return
    }

    const { data: sessions, error: fetchError } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userData.user.id)
      .eq('workout_id', selectedWorkoutId)
      .is('completed_at', null)
    console.log('Session fetch attempt:', { sessions, fetchError })

    if (fetchError) {
      console.log('Error fetching sessions:', fetchError)
      toast({
        title: 'Error fetching sessions',
        description: fetchError.message,
        variant: 'destructive',
      })
      return
    }

    if (sessions && sessions.length > 0) {
      console.log('Existing session found:', sessions[0])
      setCurrentWorkoutSession(sessions[0])
      fetchWorkoutExercises(selectedWorkoutId) // Fetch exercises for this session
      toast({ title: 'Continuing existing session', variant: 'success' })
    } else {
      console.log('No existing session found, creating a new one.')

      const { data: createdSessions, error: creationError } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: userData.user.id,
          workout_id: selectedWorkoutId,
          started_at: new Date().toISOString(),
        })
        .select()
      console.log('Session creation attempt:', {
        createdSessions,
        creationError,
      })

      if (creationError || !createdSessions || createdSessions.length === 0) {
        console.log('Error creating new session:', creationError)
        toast({
          title: 'Error creating session',
          description:
            creationError?.message || 'Unknown error creating session',
          variant: 'destructive',
        })
      } else {
        console.log('New session created successfully:', createdSessions[0])
        setCurrentWorkoutSession(createdSessions[0])
        fetchWorkoutExercises(selectedWorkoutId) // Immediately fetch exercises for the new session
        toast({ title: 'New workout session started', variant: 'success' })
      }
    }
  }

  useEffect(() => {
    const checkAndStartSession = async () => {
      if (!selectedWorkoutId) return

      const user = supabase.auth.getUser()
      if (!user) {
        toast({ title: 'User not authenticated', variant: 'destructive' })
        return
      }

      // Attempt to fetch an existing workout session
      let { data: existingSessions, error: fetchError } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .is('completed_at', null)
        .single() // Assuming each user can have only one active session

      if (fetchError) {
        console.error('Error fetching existing workout session:', fetchError)
        return
      }

      if (existingSessions) {
        console.log('Using existing session:', existingSessions)
        setCurrentWorkoutSession(existingSessions)
        // Here, you might also want to set other state variables based on the existing session's data
      } else {
        // No existing session found, start a new one
        console.log('Starting a new session for workout ID:', selectedWorkoutId)
        const { data: newSession, error: startError } = await supabase
          .from('workout_sessions')
          .insert([
            {
              user_id: user.id,
              workout_id: selectedWorkoutId,
              started_at: new Date().toISOString(),
              // Set other necessary fields
            },
          ])
          .single() // Assuming you're creating one session at a time

        if (startError) {
          console.error('Error starting new workout session:', startError)
          return
        }

        setCurrentWorkoutSession(newSession)
        // Set other necessary state based on the new session
      }
    }

    checkAndStartSession()
  }, [selectedWorkoutId]) // React to changes in selectedWorkoutId

  const logSet = async () => {
    if (!currentWorkoutSession) {
      console.error('No current workout session set.')
      toast({
        title: 'Workout session not started',
        description: 'Please start a workout session before logging sets.',
        variant: 'destructive',
      })
      return
    }
    if (!reps || !weight || !rpe) {
      toast({
        title: 'Missing data',
        description: 'Please enter reps, weight, and RPE values.',
        variant: 'destructive',
      })
      return
    }

    const user = await supabase.auth.getUser()
    const { error } = await supabase.from('workout_logs').insert([
      {
        workout_id: selectedWorkoutId,
        user_id: user.data.user.id,
        exercise_id: workoutExercises[currentExerciseIndex].exercise_id,
        set_number: currentSet,
        reps_completed: parseInt(reps),
        weight_completed: parseFloat(weight),
        rpe: parseInt(rpe),
        started_at: new Date().toISOString(),
        workout_session_id: currentWorkoutSession.id, // Use the current session ID
      },
    ])

    if (error) {
      console.error('Error logging set:', error)
      toast({
        title: 'Error logging set',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      if (currentSet === workoutExercises[currentExerciseIndex].sets) {
        if (currentExerciseIndex === workoutExercises.length - 1) {
          // Workout completed
          setIsTimerRunning(false)
          setTimeRemaining(0)
          toast({
            title: 'Workout completed',
            description: 'Great job! You finished your workout session.',
            variant: 'success',
          })
        } else {
          const { error: updateError } = await supabase
            .from('workout_sessions')
            .update({
              current_exercise_index: currentExerciseIndex + 1,
              current_set: 1,
            })
            .eq('id', currentWorkoutSession.id)

          if (updateError) {
            console.error('Error updating workout session:', updateError)
            toast({
              title: 'Error updating workout session',
              description: updateError.message,
              variant: 'destructive',
            })
          } else {
            setCurrentExerciseIndex(currentExerciseIndex + 1)
            setCurrentSet(1)
            setIsTimerRunning(true)
            setTimeRemaining(timerDuration)
            toast({
              title: 'Next exercise',
              description: 'Moving on to the next exercise.',
              variant: 'success',
            })
          }
        }
      } else {
        const { error: updateError } = await supabase
          .from('workout_sessions')
          .update({ current_set: currentSet + 1 })
          .eq('id', currentWorkoutSession.id)

        if (updateError) {
          console.error('Error updating workout session:', updateError)
          toast({
            title: 'Error updating workout session',
            description: updateError.message,
            variant: 'destructive',
          })
        } else {
          setCurrentSet(currentSet + 1)
          setIsTimerRunning(true)
          setTimeRemaining(timerDuration)
          toast({
            title: 'Next set',
            description: 'Moving on to the next set.',
            variant: 'success',
          })
        }
      }

      setReps('')
      setWeight('')
      setRpe('')
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
      // Assuming you want to allow selecting a new workout immediately after finishing
      // the current session without refreshing or navigating away:
      setCurrentWorkoutSession(null)
      // setSelectedWorkoutId(null); // Consider if you want to clear this selection
      setCurrentExerciseIndex(0)
      setCurrentSet(1)
      setIsTimerRunning(false)
      setTimeRemaining(0)
      setWorkoutExercises([]) // Clear exercises to prepare for the next selection
      toast({
        title: 'Workout completed',
        description: 'Great job! You finished your workout session.',
        variant: 'success',
      })
    }
  }

  const handleWorkoutSelectionChange = (value) => {
    setSelectedWorkoutId(value)
    console.log('Workout selected:', value)
    // Resetting session-related states to prepare for a potential new workout session
    setCurrentExerciseIndex(0)
    setCurrentSet(1)
    // Do not automatically fetch or start a session here to allow manual start
  }

  useEffect(() => {
    let intervalId

    if (isTimerRunning) {
      intervalId = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1)
      }, 1000)
    }

    return () => clearInterval(intervalId)
  }, [isTimerRunning])

  return (
    <div className="container mx-auto max-w-6xl">
      <h1 className="mb-4 text-3xl font-bold">Workout Session</h1>

      <div>
        <h2 className="mb-2 text-2xl font-bold">Select a Workout</h2>
        <Select onValueChange={handleWorkoutSelectionChange}>
          {' '}
          {/* Fixed the typo here */}
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a workout" />
          </SelectTrigger>
          <SelectContent>
            {workouts.map((workout) => (
              <SelectItem key={workout.id} value={workout.id}>
                {workout.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Conditionally render "Start Workout" button */}
        {selectedWorkoutId && !currentWorkoutSession && (
          <Button className="mt-4" onClick={startOrContinueWorkout}>
            Start Workout
          </Button>
        )}
      </div>

      {/* Conditionally render workout session UI if a session is active */}
      {currentWorkoutSession && (
        <div>
          <h2 className="mb-2 text-2xl font-bold">
            {workouts.find((workout) => workout.id === selectedWorkoutId)
              ?.name || ''}
          </h2>
          <h3 className="mb-2 text-xl font-bold">
            Exercise:{' '}
            {workoutExercises.length > 0 &&
            currentExerciseIndex < workoutExercises.length
              ? workoutExercises[currentExerciseIndex].exercises.name
              : 'Loading...'}
          </h3>
          <div>
            <p>
              Set {currentSet} of{' '}
              {workoutExercises[currentExerciseIndex]?.sets || 0}
            </p>
            <div className="mb-4 flex gap-2">
              <Input
                type="number"
                placeholder="Reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <Input
                type="number"
                placeholder="RPE"
                value={rpe}
                onChange={(e) => setRpe(e.target.value)}
              />
            </div>
            <Button onClick={logSet}>Log Set</Button>
          </div>
          <Separator className="my-4" />
          <div>
            <p>Rest Timer: {formatTime(timeRemaining)}</p>
          </div>
          <div className="mt-4">
            <Button onClick={finishWorkout}>Finish Workout</Button>
          </div>
        </div>
      )}
    </div>
  )
}

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export default WorkoutSession
