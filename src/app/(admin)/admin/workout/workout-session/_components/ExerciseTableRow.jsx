import { TableCell, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { AiTwotoneLock } from 'react-icons/ai'
import RecommendedWorkoutData from './RecommendedWorkoutData'
import PreviousWorkoutsData from './PreviousWorkoutsData'

const ExerciseTableRow = ({
  workoutExercise,
  setNumber,
  currentWorkoutSession,
  isSetLogged,
  handleInputChange,
  logSet,
  inputValues,
  previousWorkoutLogs,
}) => {
  const prevLog = previousWorkoutLogs.find(
    (log) =>
      log.exercise_id === workoutExercise.exercise_id &&
      log.set_number === setNumber,
  )

  const recommendedData = RecommendedWorkoutData({
    workoutExerciseId: workoutExercise.exercise_id,
    setNumber,
    userId: currentWorkoutSession.user_id,
  })

  const previousWorkoutsData = PreviousWorkoutsData({
    workoutExerciseId: workoutExercise.id,
    setNumber,
    userId: currentWorkoutSession.user_id,
  })

  return (
    <TableRow>
      <TableCell>{setNumber}</TableCell>
      <TableCell>
        <div className="mb-2">
          <span className="font-bold">Previous Workout: </span>
          {prevLog ? (
            <span>{prevLog.reps_completed} reps</span>
          ) : (
            <span className="text-gray-500">
              {previousWorkoutsData.length > 0
                ? previousWorkoutsData.slice(0, 2).map((log, index) => (
                    <div key={index}>
                      <span className="font-bold">Workout {index + 1}: </span>
                      {log.reps_completed} reps
                    </div>
                  ))
                : 'No previous data'}
            </span>
          )}
          <Input
            type="number"
            value={inputValues[`${workoutExercise.id}-${setNumber}-reps`] || ''}
            onChange={(e) =>
              handleInputChange(
                workoutExercise.id,
                setNumber,
                'reps',
                e.target.value,
              )
            }
            disabled={isSetLogged}
          />
          {recommendedData && (
            <div className="mt-2">
              <span className="font-bold">Recommended Reps: </span>
              {recommendedData.reps}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="mb-2">
          <span className="font-bold">Previous Workout: </span>
          {prevLog ? (
            <span>{prevLog.weight_completed} lbs</span>
          ) : (
            <span className="text-gray-500">
              {previousWorkoutsData.length > 0
                ? previousWorkoutsData.slice(0, 2).map((log, index) => (
                    <div key={index}>
                      <span className="font-bold">Workout {index + 1}: </span>
                      {log.weight_completed} lbs
                    </div>
                  ))
                : 'No previous data'}
            </span>
          )}
          <Input
            type="number"
            value={
              inputValues[`${workoutExercise.id}-${setNumber}-weight`] || ''
            }
            onChange={(e) =>
              handleInputChange(
                workoutExercise.id,
                setNumber,
                'weight',
                e.target.value,
              )
            }
            disabled={isSetLogged}
          />
          {recommendedData && (
            <div className="mt-2">
              <span className="font-bold">Recommended Weight: </span>
              {recommendedData.weight} lbs
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="mb-2">
          <span className="font-bold">Previous Workout: </span>
          {prevLog ? (
            <span>RPE {prevLog.rpe}</span>
          ) : (
            <span className="text-gray-500">
              {previousWorkoutsData.length > 0
                ? previousWorkoutsData.slice(0, 2).map((log, index) => (
                    <div key={index}>
                      <span className="font-bold">Workout {index + 1}: </span>
                      RPE {log.rpe}
                    </div>
                  ))
                : 'No previous data'}
            </span>
          )}
          <Input
            type="number"
            value={inputValues[`${workoutExercise.id}-${setNumber}-rpe`] || ''}
            onChange={(e) =>
              handleInputChange(
                workoutExercise.id,
                setNumber,
                'rpe',
                e.target.value,
              )
            }
            disabled={isSetLogged}
          />
          {recommendedData && (
            <div className="mt-2">
              <span className="font-bold">Recommended RPE: </span>
              {recommendedData.rpe}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Button
          onClick={() => logSet(workoutExercise.id, setNumber)}
          disabled={isSetLogged}
        >
          {isSetLogged ? (
            <>
              <AiTwotoneLock className="mr-2 h-4 w-4" /> Logged
            </>
          ) : (
            'Log Set'
          )}
        </Button>
      </TableCell>
    </TableRow>
  )
}

export default ExerciseTableRow
