import { useState } from 'react'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from '@/components/ui/table'
import ExerciseTableRow from './ExerciseTableRow'
import AddOrRemoveSet from './AddOrRemoveSet'

const ExerciseTable = ({
  workoutExercise,
  currentWorkoutSession,
  currentSetIndex,
  handleInputChange,
  updateWorkoutExercises,
  recommendedSets,
  inputValues,
}) => {
  const [lockedSets, setLockedSets] = useState({})

  const toggleLock = (setNumber) => {
    setLockedSets((prevLockedSets) => ({
      ...prevLockedSets,
      [setNumber]: !prevLockedSets[setNumber],
    }))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Set</TableHead>
          <TableHead>
            Reps Min: {workoutExercise.min_reps} Max: {workoutExercise.max_reps}
          </TableHead>
          <TableHead>Weight: {workoutExercise.weight}</TableHead>
          <TableHead>RPE</TableHead>
          <TableHead>Actions</TableHead>
          <TableHead>Lock</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(workoutExercise.sets)].map((_, index) => {
          const setNumber = index + 1
          const isSetLogged = currentSetIndex[workoutExercise.id] >= setNumber

          return (
            <ExerciseTableRow
              key={setNumber}
              workoutExercise={workoutExercise}
              setNumber={setNumber}
              currentWorkoutSession={currentWorkoutSession}
              isSetLogged={isSetLogged}
              handleInputChange={handleInputChange}
              inputValues={inputValues}
              isLocked={lockedSets[setNumber]}
              toggleLock={() => toggleLock(setNumber)}
            />
          )
        })}
      </TableBody>
      <AddOrRemoveSet
        workoutExerciseId={workoutExercise.id}
        currentSets={workoutExercise.sets}
        updateWorkoutExercises={updateWorkoutExercises}
        currentWorkoutSession={currentWorkoutSession}
      />
    </Table>
  )
}

export default ExerciseTable
