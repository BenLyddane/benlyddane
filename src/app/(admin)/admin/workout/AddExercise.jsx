// AddExercise.jsx
import React, { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ExerciseSearch from './ExerciseSearch'
import { useToast } from '@/components/ui/use-toast'

const AddExercise = ({
  exercises,
  currentWorkout,
  workoutExercises,
  setWorkoutExercises,
}) => {
  const supabase = createClient()
  const [selectedExerciseId, setSelectedExerciseId] = useState(null)
  const [exerciseSearch, setExerciseSearch] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')
  const [restTimerDuration, setRestTimerDuration] = useState('')
  const { toast } = useToast()

  const handleAddExercise = async () => {
    if (selectedExerciseId && sets && reps && weight && currentWorkout) {
      const exercise = {
        workout_id: currentWorkout.id,
        exercise_id: selectedExerciseId,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: parseFloat(weight),
        rest_timer_duration: restTimerDuration
          ? parseInt(restTimerDuration)
          : null,
      }

      setSelectedExerciseId(null)
      setSets('')
      setReps('')
      setWeight('')
      setRestTimerDuration('')

      const { data, error } = await supabase
        .from('workout_exercises')
        .insert([exercise])
        .select('*, exercise:exercises(*)')
        .single()
      if (!error && data) {
        setWorkoutExercises([...workoutExercises, data])
        toast({
          title: 'Success',
          description: 'Exercise added to workout successfully.',
          variant: 'success',
        })
      } else {
        console.error('Error adding exercise:', error)
        toast({
          title: 'Error',
          description: 'Failed to add exercise to workout.',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Add Exercise</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <ExerciseSearch
            exercises={exercises}
            setSelectedExerciseId={setSelectedExerciseId}
            setExerciseSearch={setExerciseSearch}
          />
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
  )
}

export default AddExercise
