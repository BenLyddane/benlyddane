// WorkoutSelector.jsx
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const WorkoutSelector = ({
  workouts,
  selectedWorkoutId,
  onWorkoutSelectionChange,
  onStartWorkout,
  currentWorkoutSession,
}) => {
  return (
    <>
      <Select onValueChange={onWorkoutSelectionChange}>
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

      {selectedWorkoutId && !currentWorkoutSession && (
        <Button className="mt-4" onClick={onStartWorkout}>
          Start Workout
        </Button>
      )}
    </>
  )
}

export default WorkoutSelector
