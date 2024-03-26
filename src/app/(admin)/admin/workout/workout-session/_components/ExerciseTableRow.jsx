import { useState, useEffect } from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import {
  logOrUpdateSetToDatabase,
  checkExistingLog,
} from '../_functions/LogSetToDatabase'
import PreviousWorkoutsDisplay from './PreviousWorkoutsDisplay'
import RecommendedWeightRepsRPEDisplay from './RecommendedWeightRepsRPEDisplay'
import { AiOutlineLock, AiOutlineUnlock } from 'react-icons/ai'

const ExerciseTableRow = ({
  workoutExercise,
  setNumber,
  currentWorkoutSession,
  handleInputChange,
  inputValues,
  recommendedSets,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const { toast } = useToast()
  const [loggedSetData, setLoggedSetData] = useState(null)

  useEffect(() => {
    const fetchLoggedSetData = async () => {
      const loggedSet = await checkExistingLog({
        workoutId: currentWorkoutSession.workout_id,
        userId: currentWorkoutSession.user_id,
        exerciseId: workoutExercise.exercise_id,
        workoutExerciseId: workoutExercise.id,
        setNumber,
        workoutSessionId: currentWorkoutSession.id,
      })
      setLoggedSetData(loggedSet)
      setIsLocked(!!loggedSet) // Lock the row if a set is already logged
    }

    fetchLoggedSetData()
  }, [
    currentWorkoutSession.workout_id,
    currentWorkoutSession.user_id,
    workoutExercise.exercise_id,
    workoutExercise.id,
    setNumber,
    currentWorkoutSession.id,
  ])

  const logSet = async () => {
    setIsLoading(true)
    const { error } = await logOrUpdateSetToDatabase({
      workoutId: currentWorkoutSession.workout_id,
      userId: currentWorkoutSession.user_id,
      exerciseId: workoutExercise.exercise_id,
      workoutExerciseId: workoutExercise.id,
      setNumber,
      reps: inputValues[`${workoutExercise.id}-${setNumber}-repetitions`],
      weight: inputValues[`${workoutExercise.id}-${setNumber}-weight`],
      rpe: inputValues[`${workoutExercise.id}-${setNumber}-rpe`],
      workoutSessionId: currentWorkoutSession.id,
      toast,
    })
    setIsLoading(false)
    if (!error) {
      setIsLocked(true) // Lock the row after successful logging
    }
  }

  const toggleLock = () => {
    setIsLocked(!isLocked)
  }

  return (
    <TableRow>
      <TableCell>{setNumber}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="0"
            min={workoutExercise.min_reps}
            max={workoutExercise.max_reps}
            value={
              isLocked && loggedSetData
                ? loggedSetData.reps_completed || ''
                : inputValues[
                    `${workoutExercise.id}-${setNumber}-repetitions`
                  ] || ''
            }
            onChange={(e) =>
              handleInputChange(
                workoutExercise.id,
                setNumber,
                'repetitions',
                e.target.value,
              )
            }
            disabled={isLocked}
          />
          <PreviousWorkoutsDisplay
            workoutExerciseId={workoutExercise.id}
            setNumber={setNumber}
            userId={currentWorkoutSession.user_id}
            field="reps"
          />
        </div>
        <RecommendedWeightRepsRPEDisplay
          workoutExercise={workoutExercise}
          setNumber={setNumber}
          userId={currentWorkoutSession.user_id}
          field="reps"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="0"
            value={
              isLocked && loggedSetData
                ? loggedSetData.weight_completed || ''
                : inputValues[`${workoutExercise.id}-${setNumber}-weight`] || ''
            }
            onChange={(e) =>
              handleInputChange(
                workoutExercise.id,
                setNumber,
                'weight',
                e.target.value,
              )
            }
            disabled={isLocked}
          />
          <PreviousWorkoutsDisplay
            workoutExerciseId={workoutExercise.id}
            setNumber={setNumber}
            userId={currentWorkoutSession.user_id}
            field="weight"
          />
        </div>
        <RecommendedWeightRepsRPEDisplay
          workoutExercise={workoutExercise}
          setNumber={setNumber}
          userId={currentWorkoutSession.user_id}
          field="weight"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="0"
            min={1}
            max={10}
            value={
              isLocked && loggedSetData
                ? loggedSetData.rpe || ''
                : inputValues[`${workoutExercise.id}-${setNumber}-rpe`] || ''
            }
            onChange={(e) =>
              handleInputChange(
                workoutExercise.id,
                setNumber,
                'rpe',
                e.target.value,
              )
            }
            disabled={isLocked}
          />
          <PreviousWorkoutsDisplay
            workoutExerciseId={workoutExercise.id}
            setNumber={setNumber}
            userId={currentWorkoutSession.user_id}
            field="rpe"
          />
        </div>
        <RecommendedWeightRepsRPEDisplay
          workoutExercise={workoutExercise}
          setNumber={setNumber}
          userId={currentWorkoutSession.user_id}
          field="rpe"
        />
      </TableCell>
      <TableCell>
        <Button onClick={logSet} disabled={isLocked || isLoading}>
          {isLocked ? 'Logged' : 'Log Set'}
        </Button>
      </TableCell>
      <TableCell>
        <Button variant="ghost" onClick={toggleLock} disabled={isLoading}>
          {isLocked ? <AiOutlineUnlock /> : <AiOutlineLock />}
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default ExerciseTableRow
