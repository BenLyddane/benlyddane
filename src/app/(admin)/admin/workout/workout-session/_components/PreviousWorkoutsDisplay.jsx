import { useState, useEffect } from 'react'
import { HiOutlineClipboardList } from 'react-icons/hi'
import getPreviousWorkoutsData from '../_functions/PreviousWorkoutsData'

const PreviousWorkoutsDisplay = ({
  workoutExerciseId,
  setNumber,
  userId,
  field,
}) => {
  const [previousWorkoutData, setPreviousWorkoutData] = useState([])

  useEffect(() => {
    const fetchPreviousWorkoutData = async () => {
      const data = await getPreviousWorkoutsData({
        workoutExerciseId,
        setNumber,
        userId,
      })
      setPreviousWorkoutData(data)
    }
    fetchPreviousWorkoutData()
  }, [workoutExerciseId, setNumber, userId])

  if (previousWorkoutData.length === 0) return null

  const formattedData = previousWorkoutData
    .map((item) => {
      if (field === 'reps') {
        return item.reps_completed
      } else if (field === 'weight') {
        return item.weight_completed
      } else if (field === 'rpe') {
        return item.rpe
      }
      return null
    })
    .filter((value) => value !== null)
    .slice(-2)
  const displayData = formattedData.join(' / ')

  return (
    <div className="ml-2 flex items-center space-x-1 text-sm text-muted-foreground">
      <HiOutlineClipboardList className="h-4 w-4" />
      <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
        {displayData}
      </span>
    </div>
  )
}

export default PreviousWorkoutsDisplay
