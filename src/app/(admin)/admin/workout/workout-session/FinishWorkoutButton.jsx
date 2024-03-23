import { Button } from '@/components/ui/button'

const FinishWorkoutButton = ({ onFinishWorkout }) => {
  return (
    <Button
      onClick={onFinishWorkout}
      className="rounded bg-blue-500 px-4 py-2 text-white"
    >
      Finish Workout
    </Button>
  )
}

export default FinishWorkoutButton
