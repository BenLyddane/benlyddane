import { Button } from '@/components/ui/button'

const SetButtons = ({ addSet, removeSet, workoutExerciseId }) => {
  return (
    <div className="mt-4 flex justify-end">
      <Button onClick={() => addSet(workoutExerciseId)}>Add Set</Button>
      <Button className="ml-2" onClick={() => removeSet(workoutExerciseId)}>
        Remove Set
      </Button>
    </div>
  )
}

export default SetButtons