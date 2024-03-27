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
import getRecommendedWeightRepsRPE from '../_functions/RecommendedWeightRepRPE'
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai'
import RestTimer from './RestTimer'

const ExerciseTableRow = ({
  workoutExercise,
  setNumber,
  currentWorkoutSession,
  handleInputChange,
  inputValues,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const { toast } = useToast()
  const [loggedSetData, setLoggedSetData] = useState(null)
  const [startTimer, setStartTimer] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [recommendedData, setRecommendedData] = useState(null)

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
      setIsLocked(!!loggedSet)
      setStartTimer(false)
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

  useEffect(() => {
    const fetchRecommendedData = async () => {
      const recommended = await getRecommendedWeightRepsRPE({
        workoutExerciseId: workoutExercise.id,
        userId: currentWorkoutSession.user_id,
        setNumber,
      })
      setRecommendedData(recommended)
    }

    fetchRecommendedData()
  }, [workoutExercise, currentWorkoutSession.user_id, setNumber])

  const toggleLockAndLogSet = async () => {
    const reps = inputValues[`${workoutExercise.id}-${setNumber}-repetitions`]
    const weight = inputValues[`${workoutExercise.id}-${setNumber}-weight`]
    const rpe = inputValues[`${workoutExercise.id}-${setNumber}-rpe`]

    if (!reps || !weight || !rpe) {
      toast({
        title: 'Missing input',
        description:
          'Please complete all inputs (weight, reps, and RPE) to log the set.',
        variant: 'destructive',
      })
      return
    }

    if (isLocked) {
      setIsLocked(false)
    } else {
      setIsLoading(true)
      const { error } = await logOrUpdateSetToDatabase({
        workoutId: currentWorkoutSession.workout_id,
        userId: currentWorkoutSession.user_id,
        exerciseId: workoutExercise.exercise_id,
        workoutExerciseId: workoutExercise.id,
        setNumber,
        reps,
        weight,
        rpe,
        workoutSessionId: currentWorkoutSession.id,
        toast,
      })
      setIsLoading(false)
      if (!error) {
        setIsLocked(true)
        if (!loggedSetData) {
          setStartTimer(true)
          setTimerKey((prevKey) => prevKey + 1)
        }
        // Update inputValues with the logged set data
        handleInputChange(workoutExercise.id, setNumber, 'repetitions', reps)
        handleInputChange(workoutExercise.id, setNumber, 'weight', weight)
        handleInputChange(workoutExercise.id, setNumber, 'rpe', rpe)
      }
    }
  }

  const handleTimerEnd = () => {
    setStartTimer(false)
  }

  return (
    <TableRow
      className={`flex flex-col sm:table-row ${
        isLocked ? 'border-2 border-emerald-500' : ''
      }`}
    >
      <TableCell className="w-full sm:w-auto">{setNumber}</TableCell>
      <TableCell className="w-full sm:w-auto">
        <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
          <Input
            type="number"
            placeholder={
              isLocked
                ? ''
                : recommendedData?.reps
                  ? `${recommendedData.reps}`
                  : ''
            }
            min={workoutExercise.min_reps}
            max={workoutExercise.max_reps}
            value={
              isLocked
                ? loggedSetData?.reps_completed || ''
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
            className="w-full sm:w-auto"
          />
          <PreviousWorkoutsDisplay
            workoutExerciseId={workoutExercise.id}
            setNumber={setNumber}
            userId={currentWorkoutSession.user_id}
            field="reps"
            excludeWorkoutSessionId={currentWorkoutSession.id}
          />
        </div>
        <RecommendedWeightRepsRPEDisplay
          workoutExercise={workoutExercise}
          setNumber={setNumber}
          userId={currentWorkoutSession.user_id}
          field="reps"
        />
      </TableCell>
      <TableCell className="w-full sm:w-auto">
        <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
          <Input
            type="number"
            placeholder={
              isLocked
                ? ''
                : recommendedData?.weight
                  ? `${recommendedData.weight}`
                  : ''
            }
            value={
              isLocked
                ? loggedSetData?.weight_completed || ''
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
            className="w-full sm:w-auto"
          />
          <PreviousWorkoutsDisplay
            workoutExerciseId={workoutExercise.id}
            setNumber={setNumber}
            userId={currentWorkoutSession.user_id}
            field="weight"
            excludeWorkoutSessionId={currentWorkoutSession.id}
          />
        </div>
        <RecommendedWeightRepsRPEDisplay
          workoutExercise={workoutExercise}
          setNumber={setNumber}
          userId={currentWorkoutSession.user_id}
          field="weight"
        />
      </TableCell>
      <TableCell className="w-full sm:w-auto">
        <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
          <Input
            type="number"
            placeholder={
              isLocked
                ? ''
                : recommendedData?.rpe
                  ? `${recommendedData.rpe}`
                  : ''
            }
            min={1}
            max={10}
            value={
              isLocked
                ? loggedSetData?.rpe || ''
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
            className="w-full sm:w-auto"
          />
          <PreviousWorkoutsDisplay
            workoutExerciseId={workoutExercise.id}
            setNumber={setNumber}
            userId={currentWorkoutSession.user_id}
            field="rpe"
            excludeWorkoutSessionId={currentWorkoutSession.id}
          />
        </div>
        <RecommendedWeightRepsRPEDisplay
          workoutExercise={workoutExercise}
          setNumber={setNumber}
          userId={currentWorkoutSession.user_id}
          field="rpe"
        />
      </TableCell>
      <TableCell className="w-full sm:w-auto">
        <Button
          onClick={toggleLockAndLogSet}
          disabled={isLoading}
          variant={isLocked ? 'secondary' : 'default'}
          className="w-full sm:w-auto"
        >
          {isLocked ? <AiOutlineClose /> : <AiOutlineCheck />}
        </Button>
      </TableCell>
      <TableCell className="w-full sm:w-auto">
        {startTimer && (
          <RestTimer
            key={timerKey}
            timeRemaining={workoutExercise.rest_timer_duration}
            onTimerEnd={handleTimerEnd}
          />
        )}
      </TableCell>
    </TableRow>
  )
}

export default ExerciseTableRow
