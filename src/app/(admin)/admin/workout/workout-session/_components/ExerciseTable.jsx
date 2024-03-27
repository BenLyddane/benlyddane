// ExerciseTable.js
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from '@/components/ui/table'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import ExerciseTableRow from './ExerciseTableRow'
import AddOrRemoveSet from './AddOrRemoveSet'

const ExerciseTable = ({
  workoutExercise,
  currentWorkoutSession,
  handleInputChange,
  updateWorkoutExercises,
  inputValues,
}) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-center">{workoutExercise.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Set</TableHead>
                <TableHead>
                  <span className="block">Reps</span>
                  <span className="block text-sm text-gray-500">
                    Min: {workoutExercise.min_reps} Max:{' '}
                    {workoutExercise.max_reps}
                  </span>
                </TableHead>
                <TableHead>
                  <span className="block">Weight</span>
                  <span className="block text-sm text-gray-500">
                    {workoutExercise.weight}
                  </span>
                </TableHead>
                <TableHead>RPE</TableHead>
                <TableHead>Log Set</TableHead>
                <TableHead>Timer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(workoutExercise.sets)].map((_, index) => {
                const setNumber = index + 1
                return (
                  <ExerciseTableRow
                    key={setNumber}
                    workoutExercise={workoutExercise}
                    setNumber={setNumber}
                    currentWorkoutSession={currentWorkoutSession}
                    handleInputChange={handleInputChange}
                    inputValues={inputValues}
                  />
                )
              })}
            </TableBody>
          </Table>
        </div>
        <AddOrRemoveSet
          workoutExerciseId={workoutExercise.id}
          currentSets={workoutExercise.sets}
          updateWorkoutExercises={updateWorkoutExercises}
          currentWorkoutSession={currentWorkoutSession}
        />
      </CardContent>
    </Card>
  )
}

export default ExerciseTable
