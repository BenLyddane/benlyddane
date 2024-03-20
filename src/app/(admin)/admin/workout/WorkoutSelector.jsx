// WorkoutSelector.jsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

const WorkoutSelector = ({
  workouts,
  currentWorkout,
  setCurrentWorkout,
  handleDeleteWorkout,
}) => {
  const { toast } = useToast()

  const handleWorkoutChange = (workoutId) => {
    const selectedWorkout = workouts.find((w) => w.id === workoutId)
    setCurrentWorkout(selectedWorkout)
  }

  const handleDelete = async () => {
    if (currentWorkout) {
      const confirmed = window.confirm(
        'Are you sure you want to delete this workout?',
      )
      if (confirmed) {
        await handleDeleteWorkout(currentWorkout.id)
        setCurrentWorkout(null)
        toast({
          title: 'Success',
          description: 'Workout deleted successfully.',
          variant: 'success',
        })
      }
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Select Workout</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <Select
            value={currentWorkout?.id}
            onValueChange={handleWorkoutChange}
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
          <Button onClick={handleDelete} variant="destructive">
            Delete Workout
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default WorkoutSelector
