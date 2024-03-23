'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import ExerciseTable from './_components/ExerciseTable'
import SetButtons from './_components/SetButtons'

const ExerciseList = ({
  workoutExercises,
  previousWorkoutLogs,
  currentWorkoutSession,
  setTimeRemaining,
  setWorkoutExercises,
}) => {
  const [inputValues, setInputValues] = useState({})
  const [exercises, setExercises] = useState([])
  const [currentSetIndex, setCurrentSetIndex] = useState({})
  const { toast } = useToast()

  const supabase = createClient()

  useEffect(() => {
    const fetchExercises = async () => {
      console.log('Fetching exercises...')
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('*')

      if (exercisesError) {
        console.error('Error fetching exercises:', exercisesError)
        toast({
          title: 'Error fetching exercises',
          description: exercisesError.message,
          variant: 'destructive',
        })
      } else {
        console.log('Exercises fetched:', exercisesData)
        setExercises(exercisesData)
      }
    }

    fetchExercises()
  }, [supabase])

  const handleInputChange = (workoutExerciseId, setNumber, field, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [`${workoutExerciseId}-${setNumber}-${field}`]: value,
    }))
  }

  const logSet = async (workoutExerciseId, setNumber) => {
    const reps = inputValues[`${workoutExerciseId}-${setNumber}-reps`] || ''
    const weight = inputValues[`${workoutExerciseId}-${setNumber}-weight`] || ''
    const rpe = inputValues[`${workoutExerciseId}-${setNumber}-rpe`] || ''

    // Check if a workout session is active and input values are provided
    if (!isValidSetData(currentWorkoutSession, reps, weight, rpe)) {
      return
    }

    const user = await supabase.auth.getUser()
    const exerciseId = workoutExercises.find(
      (we) => we.id === workoutExerciseId,
    ).exercise_id

    // Check if a log already exists for the current set
    const existingLog = await checkExistingLog(
      currentWorkoutSession.id,
      exerciseId,
      setNumber,
    )
    if (existingLog) {
      displayErrorToast('Set already logged')
      return
    }

    // Log the set
    const logError = await logSetToDatabase(
      currentWorkoutSession.workout_id,
      user.data.user.id,
      exerciseId,
      setNumber,
      reps,
      weight,
      rpe,
      currentWorkoutSession.id,
    )

    if (logError) {
      displayErrorToast('Error logging set', logError.message)
      return
    }

    // Update UI and display toast messages
    handleSuccessfulSetLog(workoutExerciseId, setNumber)
  }

  const isValidSetData = (currentWorkoutSession, reps, weight, rpe) => {
    if (!currentWorkoutSession) {
      displayErrorToast('Workout session not started')
      return false
    }

    if (!reps || !weight || !rpe) {
      displayErrorToast('Missing data')
      return false
    }

    return true
  }

  const checkExistingLog = async (workoutSessionId, exerciseId, setNumber) => {
    const { data: existingLog, error: existingLogError } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('workout_session_id', workoutSessionId)
      .eq('exercise_id', exerciseId)
      .eq('set_number', setNumber)

    if (existingLogError) {
      displayErrorToast('Error checking existing log', existingLogError.message)
      return null
    }

    return existingLog.length > 0 ? existingLog[0] : null
  }

  const logSetToDatabase = async (
    workoutId,
    userId,
    exerciseId,
    setNumber,
    reps,
    weight,
    rpe,
    workoutSessionId,
  ) => {
    const { error } = await supabase.from('workout_logs').insert([
      {
        workout_id: workoutId,
        user_id: userId,
        exercise_id: exerciseId,
        set_number: setNumber,
        reps_completed: parseInt(reps),
        weight_completed: parseFloat(weight),
        rpe: parseInt(rpe),
        started_at: new Date().toISOString(),
        workout_session_id: workoutSessionId,
      },
    ])

    return error
  }

  const handleSuccessfulSetLog = (workoutExerciseId, setNumber) => {
    console.log('Set logged successfully')

    // Reset the timer based on the rest_timer_duration from workout_exercises
    const restTimerDuration =
      workoutExercises.find((we) => we.id === workoutExerciseId)
        .rest_timer_duration || 0
    setTimeRemaining(restTimerDuration)

    const currentExerciseIndex = workoutExercises.findIndex(
      (we) => we.id === workoutExerciseId,
    )

    // Update the current set index for the current exercise
    setCurrentSetIndex((prevState) => ({
      ...prevState,
      [workoutExerciseId]: setNumber,
    }))

    if (setNumber === workoutExercises[currentExerciseIndex].sets) {
      if (currentExerciseIndex === workoutExercises.length - 1) {
        // Workout completed
        setTimeRemaining(0)
        displaySuccessToast(
          'Workout completed',
          'Great job! You finished your workout session.',
        )
      } else {
        displaySuccessToast('Next exercise', 'Moving on to the next exercise.')
      }
    } else {
      displaySuccessToast('Next set', 'Moving on to the next set.')
    }
  }

  const displayErrorToast = (title, description = '') => {
    toast({
      title,
      description,
      variant: 'destructive',
    })
  }

  const displaySuccessToast = (title, description) => {
    toast({
      title,
      description,
      variant: 'success',
    })
  }

  const addSet = async (workoutExerciseId) => {
    try {
      // Get the current number of sets for the workout exercise
      const {
        data: currentWorkoutExerciseData,
        error: currentWorkoutExerciseError,
      } = await supabase
        .from('workout_exercises')
        .select('sets')
        .eq('id', workoutExerciseId)
        .single()

      if (currentWorkoutExerciseError) {
        console.error(
          'Error getting current workout exercise data:',
          currentWorkoutExerciseError,
        )
        toast({
          title: 'Error adding set',
          description: currentWorkoutExerciseError.message,
          variant: 'destructive',
        })
        return
      }

      const currentSets = currentWorkoutExerciseData.sets

      // Update the number of sets for the workout exercise
      const { error: updateError } = await supabase
        .from('workout_exercises')
        .update({ sets: currentSets + 1 })
        .eq('id', workoutExerciseId)

      if (updateError) {
        console.error('Error adding set:', updateError)
        toast({
          title: 'Error adding set',
          description: updateError.message,
          variant: 'destructive',
        })
      } else {
        const { data: updatedWorkoutExerciseData, error: fetchError } =
          await supabase
            .from('workout_exercises')
            .select('*')
            .eq('id', workoutExerciseId)
            .single()

        if (fetchError) {
          console.error(
            'Error fetching updated workout exercise data:',
            fetchError,
          )
          toast({
            title: 'Error adding set',
            description: fetchError.message,
            variant: 'destructive',
          })
        } else {
          console.log('Set added:', updatedWorkoutExerciseData)
          setWorkoutExercises((prevExercises) =>
            prevExercises.map((exercise) =>
              exercise.id === workoutExerciseId
                ? updatedWorkoutExerciseData
                : exercise,
            ),
          )
          toast({
            title: 'Set added',
            description: 'A new set has been added to the exercise.',
            variant: 'success',
          })
        }
      }
    } catch (error) {
      console.error('Error adding set:', error)
      toast({
        title: 'Error adding set',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const removeSet = async (workoutExerciseId) => {
    console.log(`Removing set for workout exercise ID: ${workoutExerciseId}`)

    try {
      // Get the current number of sets for the workout exercise
      const {
        data: currentWorkoutExerciseData,
        error: currentWorkoutExerciseError,
      } = await supabase
        .from('workout_exercises')
        .select('sets')
        .eq('id', workoutExerciseId)
        .single()

      if (currentWorkoutExerciseError) {
        console.error(
          'Error getting current workout exercise data:',
          currentWorkoutExerciseError,
        )
        toast({
          title: 'Error removing set',
          description: currentWorkoutExerciseError.message,
          variant: 'destructive',
        })
        return
      }

      const currentSets = currentWorkoutExerciseData.sets

      if (currentSets <= 1) {
        toast({
          title: 'Cannot remove set',
          description: 'There must be at least one set for each exercise.',
          variant: 'destructive',
        })
        return
      }

      // Update the number of sets for the workout exercise
      const { error: updateError } = await supabase
        .from('workout_exercises')
        .update({ sets: currentSets - 1 })
        .eq('id', workoutExerciseId)

      if (updateError) {
        console.error('Error removing set:', updateError)
        toast({
          title: 'Error removing set',
          description: updateError.message,
          variant: 'destructive',
        })
      } else {
        const { data: updatedWorkoutExerciseData, error: fetchError } =
          await supabase
            .from('workout_exercises')
            .select('*')
            .eq('id', workoutExerciseId)
            .single()

        if (fetchError) {
          console.error(
            'Error fetching updated workout exercise data:',
            fetchError,
          )
          toast({
            title: 'Error removing set',
            description: fetchError.message,
            variant: 'destructive',
          })
        } else {
          console.log('Set removed:', updatedWorkoutExerciseData)
          setWorkoutExercises((prevExercises) =>
            prevExercises.map((exercise) =>
              exercise.id === workoutExerciseId
                ? updatedWorkoutExerciseData
                : exercise,
            ),
          )
          toast({
            title: 'Set removed',
            description: 'A set has been removed from the exercise.',
            variant: 'success',
          })
        }
      }
    } catch (error) {
      console.error('Error removing set:', error)
      toast({
        title: 'Error removing set',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      {workoutExercises
        .sort((a, b) => a.order - b.order)
        .map((workoutExercise, exerciseIndex) => {
          const exerciseData = exercises.find(
            (e) => e.id === workoutExercise.exercise_id,
          )
          return (
            <div key={workoutExercise.id} className="mb-8">
              <h3 className="mb-4 text-xl font-bold">
                {exerciseData ? exerciseData.name : 'Exercise Name'}
              </h3>
              <ExerciseTable
                workoutExercise={workoutExercise}
                currentWorkoutSession={currentWorkoutSession}
                currentSetIndex={currentSetIndex}
                handleInputChange={handleInputChange}
                logSet={logSet}
                inputValues={inputValues}
                previousWorkoutLogs={previousWorkoutLogs}
              />
              <SetButtons
                addSet={addSet}
                removeSet={removeSet}
                workoutExerciseId={workoutExercise.id}
              />
            </div>
          )
        })}
    </>
  )
}

export default ExerciseList
