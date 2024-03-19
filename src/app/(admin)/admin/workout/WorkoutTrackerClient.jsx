'use client'
import React, { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const WorkoutTrackerClient = ({ exercises, workouts }) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState('')
  const [exerciseSearch, setExerciseSearch] = useState('')
  const [filteredExercises, setFilteredExercises] = useState([])
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [restTimerDuration, setRestTimerDuration] = useState('')
  const [newWorkoutName, setNewWorkoutName] = useState('')
  const [currentWorkout, setCurrentWorkout] = useState(null)
  const [workoutExercises, setWorkoutExercises] = useState([])
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false)

  useEffect(() => {
    setFilteredExercises(exercises)
  }, [exercises])

  const handleSearchExercise = (query) => {
    const filteredExercises = exercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredExercises(filteredExercises)
  }

  const handleAddExercise = async () => {
    if (selectedExerciseId && sets && reps && weight && currentWorkout) {
      const exercise = {
        workout_id: currentWorkout.id,
        exercise_id: selectedExerciseId,
        sets,
        reps,
        weight,
        rest_timer_duration: restTimerDuration,
      }
      setSelectedExerciseId('')
      setSets('')
      setReps('')
      setWeight('')
      setRestTimerDuration('')
      const newExercise = await addExercise(exercise)
      setWorkoutExercises([...workoutExercises, newExercise])
    }
  }

  const handleCreateWorkout = async () => {
    if (newWorkoutName) {
      const user = supabase.auth.user()

      if (user) {
        const newWorkout = await createWorkout(newWorkoutName, user.id)
        setNewWorkoutName('')
        setCurrentWorkout(newWorkout)
        setWorkoutExercises([])
      } else {
        console.error('User not logged in')
      }
    }
  }

  const handleDeleteExercise = async (exerciseId) => {
    const success = await deleteExercise(exerciseId)
    if (success) {
      setWorkoutExercises(
        workoutExercises.filter((exercise) => exercise.id !== exerciseId),
      )
    }
  }

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Workout Tracker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Input
                  type="text"
                  value={newWorkoutName}
                  onChange={(e) => setNewWorkoutName(e.target.value)}
                  placeholder="New Workout Name"
                />
                <Button onClick={handleCreateWorkout}>Create Workout</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Link href="/admin/workout/workout-session">
            <Button disabled={!currentWorkout || workoutExercises.length === 0}>
              Start Workout
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Select Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <Select
            value={currentWorkout?.id}
            onValueChange={(id) =>
              setCurrentWorkout(workouts.find((w) => w.id === id))
            }
            placeholder="Select a Workout"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {workouts && workouts.length > 0 ? (
                workouts.map((workout) => (
                  <SelectItem key={workout.id} value={workout.id}>
                    {workout.name}
                  </SelectItem>
                ))
              ) : (
                <div>No workouts available.</div>
              )}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add Exercise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div className="relative">
              <Input
                type="text"
                value={exerciseSearch}
                onChange={(e) => {
                  setExerciseSearch(e.target.value)
                  handleSearchExercise(e.target.value)
                }}
                placeholder="Search exercises..."
                onClick={() => setShowExerciseDropdown(!showExerciseDropdown)}
              />
              {showExerciseDropdown && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg dark:bg-gray-800">
                  {filteredExercises.length > 0 ? (
                    <ul className="py-1">
                      {filteredExercises.map((exercise) => (
                        <li
                          key={exercise.id}
                          className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                          onClick={() => {
                            setSelectedExerciseId(exercise.id)
                            setExerciseSearch(exercise.name)
                            setShowExerciseDropdown(false)
                          }}
                        >
                          {exercise.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      No exercises found.
                    </div>
                  )}
                </div>
              )}
            </div>
            <Input
              type="number"
              value={sets}
              onChange={(e) => setSets(e.target.value)}
              placeholder="Sets"
            />
            <Input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="Reps"
            />
            <Input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Weight (lbs)"
            />
            <Input
              type="number"
              value={restTimerDuration}
              onChange={(e) => setRestTimerDuration(e.target.value)}
              placeholder="Rest Timer (seconds)"
            />
          </div>
          <div className="mt-4">
            <Button onClick={handleAddExercise} disabled={!currentWorkout}>
              Add Exercise
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Workout Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          {workoutExercises.length > 0 ? (
            <div>
              <ul>
                {workoutExercises.map((exercise) => (
                  <li
                    key={exercise.id}
                    className="flex items-center justify-between"
                  >
                    <span>
                      {exercise.name} - Sets: {exercise.sets}, Reps:{' '}
                      {exercise.reps}, Weight: {exercise.weight} lbs, Rest
                      Timer: {exercise.rest_timer_duration} seconds
                    </span>
                    <Button
                      onClick={() => handleDeleteExercise(exercise.id)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p>No exercises added yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default WorkoutTrackerClient
