import React from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

const WorkoutExercisesList = ({ workoutExercises, setWorkoutExercises }) => {
  const supabase = createClient()
  const { toast } = useToast()

  const handleDeleteExercise = async (exerciseId) => {
    const { error } = await supabase
      .from('workout_exercises')
      .delete()
      .eq('id', exerciseId)

    if (!error) {
      setWorkoutExercises(
        workoutExercises.filter((exercise) => exercise.id !== exerciseId),
      )
      toast({
        title: 'Success',
        description: 'Exercise deleted from workout successfully.',
        variant: 'success',
      })
    } else {
      console.error('Error deleting exercise:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete exercise from workout.',
        variant: 'destructive',
      })
    }
  }

  const handleMoveExerciseUp = async (exerciseId) => {
    const exerciseIndex = workoutExercises.findIndex((e) => e.id === exerciseId)
    if (exerciseIndex > 0) {
      const updatedExercises = [...workoutExercises]
      const temp = updatedExercises[exerciseIndex - 1].order
      updatedExercises[exerciseIndex - 1].order =
        updatedExercises[exerciseIndex].order
      updatedExercises[exerciseIndex].order = temp
      setWorkoutExercises(updatedExercises)

      await Promise.all(
        updatedExercises.map((exercise) =>
          supabase
            .from('workout_exercises')
            .update({ order: exercise.order })
            .eq('id', exercise.id),
        ),
      )
    }
  }

  const handleMoveExerciseDown = async (exerciseId) => {
    const exerciseIndex = workoutExercises.findIndex((e) => e.id === exerciseId)
    if (exerciseIndex < workoutExercises.length - 1) {
      const updatedExercises = [...workoutExercises]
      const temp = updatedExercises[exerciseIndex + 1].order
      updatedExercises[exerciseIndex + 1].order =
        updatedExercises[exerciseIndex].order
      updatedExercises[exerciseIndex].order = temp
      setWorkoutExercises(updatedExercises)

      await Promise.all(
        updatedExercises.map((exercise) =>
          supabase
            .from('workout_exercises')
            .update({ order: exercise.order })
            .eq('id', exercise.id),
        ),
      )
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Workout Exercises</CardTitle>
      </CardHeader>
      <CardContent>
        {workoutExercises.length > 0 ? (
          <div>
            <ul>
              {workoutExercises
                .sort((a, b) => a.order - b.order)
                .map((workoutExercise, index) => (
                  <li
                    key={workoutExercise.id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span>
                        {workoutExercise.exercise.name} - Sets:{' '}
                        {workoutExercise.sets}, Reps: {workoutExercise.min_reps}
                        -{workoutExercise.max_reps}, Weight:{' '}
                        {workoutExercise.weight} lbs, Rest Timer:{' '}
                        {workoutExercise.rest_timer_duration} seconds
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {index !== 0 && (
                        <Button
                          onClick={() =>
                            handleMoveExerciseUp(workoutExercise.id)
                          }
                          variant="ghost"
                        >
                          ↑
                        </Button>
                      )}
                      {index !== workoutExercises.length - 1 && (
                        <Button
                          onClick={() =>
                            handleMoveExerciseDown(workoutExercise.id)
                          }
                          variant="ghost"
                        >
                          ↓
                        </Button>
                      )}
                      <Button
                        onClick={() => handleDeleteExercise(workoutExercise.id)}
                        variant="destructive"
                      >
                        Delete
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ) : (
          <p>No exercises added yet.</p>
        )}
      </CardContent>
    </Card>
  )
}

export default WorkoutExercisesList
