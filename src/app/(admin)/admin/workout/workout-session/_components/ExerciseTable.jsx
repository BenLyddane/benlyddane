import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
} from '@/components/ui/table'
import ExerciseTableRow from './ExerciseTableRow'

const ExerciseTable = ({
  workoutExercise,
  currentWorkoutSession,
  currentSetIndex,
  handleInputChange,
  logSet,
  inputValues, // Add this line
  previousWorkoutLogs, // Add this line
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Set</TableHead>
          <TableHead>Reps</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead>RPE</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: workoutExercise.sets }, (_, setIndex) => (
          <ExerciseTableRow
            key={`${workoutExercise.id}-${setIndex}`}
            workoutExercise={workoutExercise}
            setNumber={setIndex + 1}
            currentWorkoutSession={currentWorkoutSession}
            isSetLogged={currentSetIndex[workoutExercise.id] >= setIndex + 1}
            handleInputChange={handleInputChange}
            logSet={logSet}
            inputValues={inputValues} // Add this line
            previousWorkoutLogs={previousWorkoutLogs} // Add this line
          />
        ))}
      </TableBody>
    </Table>
  )
}

export default ExerciseTable
