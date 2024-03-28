import { Button } from '@/components/ui/button'

const FinishWorkoutButton = ({ onFinishWorkout }) => {
  return (
    <Button onClick={onFinishWorkout} className="rounded px-4 py-2">
      Finish Workout
    </Button>
  )
}

export default FinishWorkoutButton
