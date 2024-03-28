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
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const { toast } = useToast()
  const [loggedSetData, setLoggedSetData] = useState(null)
  const [startTimer, setStartTimer] = useState(false)
  const [timerKey, setTimerKey] = useState(0)
  const [recommendedData, setRecommendedData] = useState(null)
  const [inputValues, setInputValues] = useState({})
  const [rowKey, setRowKey] = useState(0)
  const [emeraldBorderSet, setEmeraldBorderSet] = useState(null) // New state for emerald border

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

      // Update the input values if logged set data exists
      if (loggedSet) {
        setInputValues({
          [`${workoutExercise.id}-${setNumber}-repetitions`]:
            loggedSet.reps_completed.toString(),
          [`${workoutExercise.id}-${setNumber}-weight`]:
            loggedSet.weight_completed.toString(),
          [`${workoutExercise.id}-${setNumber}-rpe`]: loggedSet.rpe.toString(),
        })
      } else {
        // Reset input values if no logged set data exists
        setInputValues({})
      }
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

    if (isLocked) {
      // Allow unlocking the set if it's already logged
      setIsLocked(false)
      setEmeraldBorderSet(null) // Remove emerald border when unlocking
      setRowKey((prevKey) => prevKey + 1) // Force re-render when unlocking
    } else {
      if (!reps || !weight || !rpe) {
        toast({
          title: 'Missing input',
          description:
            'Please complete all inputs (weight, reps, and RPE) to log the set.',
          variant: 'destructive',
        })
        return
      }

      setIsLoading(true)
      const { error, loggedSet } = await logOrUpdateSetToDatabase({
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
        setLoggedSetData(loggedSet)
        setInputValues({
          [`${workoutExercise.id}-${setNumber}-repetitions`]:
            loggedSet.reps_completed.toString(),
          [`${workoutExercise.id}-${setNumber}-weight`]:
            loggedSet.weight_completed.toString(),
          [`${workoutExercise.id}-${setNumber}-rpe`]: loggedSet.rpe.toString(),
        })
        setEmeraldBorderSet(setNumber) // Set emerald border for this set
        setRowKey((prevKey) => prevKey + 1) // Force re-render when logging a set
        if (!loggedSetData) {
          setStartTimer(true)
          setTimerKey((prevKey) => prevKey + 1)
        }
      }
    }
  }

  const handleTimerEnd = () => {
    setStartTimer(false)
  }

  const getInputPlaceholder = (field) => {
    if (isLocked || (loggedSetData && !isLocked)) {
      return ''
    }
    return recommendedData?.[field] ? `${recommendedData[field]}` : ''
  }

  const handleInputValues = (id, setNumber, field, value) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [`${id}-${setNumber}-${field}`]: value,
    }))
  }

  const renderInputOrValue = (field) => {
    if (isLocked) {
      // Render logged set value as static text
      return inputValues[`${workoutExercise.id}-${setNumber}-${field}`]
    }

    // Render input field
    return (
      <Input
        type="number"
        placeholder={getInputPlaceholder(field)}
        min={field === 'reps' ? workoutExercise.min_reps : null}
        max={
          field === 'reps'
            ? workoutExercise.max_reps
            : field === 'rpe'
              ? 10
              : null
        }
        value={inputValues[`${workoutExercise.id}-${setNumber}-${field}`] || ''}
        onChange={(e) =>
          handleInputValues(
            workoutExercise.id,
            setNumber,
            field,
            e.target.value,
          )
        }
        className={field === 'rpe' ? 'w-full sm:w-auto' : 'w-full sm:w-auto'}
      />
    )
  }

  return (
    <TableRow
      key={rowKey}
      className={`flex flex-col sm:table-row ${
        emeraldBorderSet === setNumber ? 'border-2 border-emerald-500' : ''
      }`}
    >
      <TableCell className="w-full sm:w-auto">{setNumber}</TableCell>
      <TableCell className="w-full sm:w-auto">
        <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
          {renderInputOrValue('repetitions')}
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
          {renderInputOrValue('weight')}
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
          {renderInputOrValue('rpe')}
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
