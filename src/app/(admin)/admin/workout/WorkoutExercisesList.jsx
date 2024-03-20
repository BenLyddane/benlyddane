// WorkoutExercisesList.jsx
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

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Workout Exercises</CardTitle>
      </CardHeader>
      <CardContent>
        {workoutExercises.length > 0 ? (
          <div>
            <ul>
              {workoutExercises.map((workoutExercise) => (
                <li
                  key={workoutExercise.id}
                  className="flex items-center justify-between"
                >
                  <span>
                    {workoutExercise.exercise.name} - Sets:{' '}
                    {workoutExercise.sets}, Reps: {workoutExercise.reps},
                    Weight: {workoutExercise.weight} lbs, Rest Timer:{' '}
                    {workoutExercise.rest_timer_duration} seconds
                  </span>
                  <Button
                    onClick={() => handleDeleteExercise(workoutExercise.id)}
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
  )
}

export default WorkoutExercisesList
