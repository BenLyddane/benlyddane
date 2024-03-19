'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'

const WorkoutSession = ({
  currentWorkout,
  workoutExercises,
  onCompleteWorkout,
}) => {
  const supabase = createClient()
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [workoutLog, setWorkoutLog] = useState(null)
  const [currentExercise, setCurrentExercise] = useState(null)
  const [currentSet, setCurrentSet] = useState(1)
  const [currentReps, setCurrentReps] = useState('')
  const [restTimerDuration, setRestTimerDuration] = useState(0)
  const [restTimerRunning, setRestTimerRunning] = useState(false)
  const [restTimerRemaining, setRestTimerRemaining] = useState(0)

  useEffect(() => {
    if (currentExercise) {
      setRestTimerDuration(currentExercise.rest_timer_duration)
    }
  }, [currentExercise])

  useEffect(() => {
    let intervalId

    if (restTimerRunning && restTimerRemaining > 0) {
      intervalId = setInterval(() => {
        setRestTimerRemaining((prevRemaining) => prevRemaining - 1)
      }, 1000)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [restTimerRunning, restTimerRemaining])

  useEffect(() => {
    if (restTimerRemaining === 0 && currentSet < currentExercise.sets) {
      setCurrentSet((prevSet) => prevSet + 1)
      setRestTimerRemaining(restTimerDuration)
    } else if (
      restTimerRemaining === 0 &&
      currentSet === currentExercise.sets
    ) {
      handleNextExercise()
    }
  }, [restTimerRemaining])

  const handleStartWorkout = async () => {
    if (currentWorkout) {
      const user = supabase.auth.user()

      if (user) {
        const { data, error } = await supabase.from('workout_logs').insert([
          {
            workout_id: currentWorkout.id,
            user_id: user.id,
            started_at: new Date().toISOString(),
          },
        ])
        if (!error && data.length > 0) {
          setWorkoutStarted(true)
          setWorkoutLog(data[0])
          setCurrentExercise(workoutExercises[0])
        } else {
          console.error('Error starting workout:', error)
        }
      } else {
        console.error('User not logged in')
      }
    }
  }

  const handleCompleteWorkout = async () => {
    if (workoutLog) {
      const { error } = await supabase
        .from('workout_logs')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', workoutLog.id)
      if (!error) {
        setWorkoutStarted(false)
        setWorkoutLog(null)
        onCompleteWorkout()
      } else {
        console.error('Error completing workout:', error)
      }
    }
  }

  const handleStartRestTimer = () => {
    setRestTimerRunning(true)
    setRestTimerRemaining(restTimerDuration)
  }

  const handleNextExercise = () => {
    const currentExerciseIndex = workoutExercises.findIndex(
      (exercise) => exercise.id === currentExercise.id,
    )
    if (currentExerciseIndex < workoutExercises.length - 1) {
      setCurrentExercise(workoutExercises[currentExerciseIndex + 1])
      setCurrentSet(1)
      setCurrentReps('')
      setRestTimerRunning(false)
      setRestTimerRemaining(0)
    } else {
      handleCompleteWorkout()
    }
  }

  const handleLogSet = () => {
    // Log the current set data to Supabase or do any other desired action
    console.log(
      `Exercise: ${currentExercise.name}, Set: ${currentSet}, Reps: ${currentReps}`,
    )
    handleNextSet()
  }

  const handleNextSet = () => {
    if (currentSet < currentExercise.sets) {
      setCurrentSet(currentSet + 1)
      setCurrentReps('')
    } else {
      handleNextExercise()
    }
  }

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = timeInSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Workout Session</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {workoutExercises.map((exercise) => (
              <AccordionItem key={exercise.id} value={exercise.id}>
                <AccordionTrigger>
                  <span>
                    {exercise.name} - Sets: {exercise.sets}, Reps:{' '}
                    {exercise.reps}, Weight: {exercise.weight} lbs, Rest Timer:{' '}
                    {exercise.rest_timer_duration} seconds
                  </span>
                </AccordionTrigger>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {currentExercise && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Current Exercise</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {currentExercise.name} - Set {currentSet}/{currentExercise.sets}
            </p>
            <Input
              type="number"
              value={currentReps}
              onChange={(e) => setCurrentReps(e.target.value)}
              placeholder="Reps"
            />
            <Button onClick={handleLogSet}>Log Set</Button>
            {!restTimerRunning && (
              <Button onClick={handleStartRestTimer}>Start Rest Timer</Button>
            )}
            {restTimerRunning && (
              <div>
                <p>Rest Timer: {formatTime(restTimerRemaining)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button onClick={handleStartWorkout} disabled={workoutStarted}>
          Start Workout
        </Button>
        <Button
          onClick={handleCompleteWorkout}
          disabled={!workoutStarted}
          variant="success"
        >
          Complete Workout
        </Button>
      </div>
    </div>
  )
}

export default WorkoutSession
