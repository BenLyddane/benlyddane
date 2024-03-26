import { AiOutlineStar } from 'react-icons/ai'
import { useState, useEffect } from 'react'
import getRecommendedWeightRepsRPE from '../_functions/RecommendedWeightRepRPE'

const RecommendedWeightRepsRPEDisplay = ({
  workoutExercise,
  setNumber,
  userId,
  field,
}) => {
  const [recommendedData, setRecommendedData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendedData = async () => {
      console.log('Fetching recommended data...')
      console.log('workoutExercise:', workoutExercise)
      console.log('setNumber:', setNumber)
      console.log('userId:', userId)

      if (!workoutExercise || !workoutExercise.id) {
        console.error('Invalid workoutExercise object:', workoutExercise)
        setRecommendedData({ error: 'Invalid workout exercise' })
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      const recommended = await getRecommendedWeightRepsRPE({
        workoutExerciseId: workoutExercise.id,
        userId,
        setNumber,
      })

      console.log('Recommended data:', recommended)
      setRecommendedData(recommended)
      setIsLoading(false)
    }

    fetchRecommendedData()
  }, [workoutExercise, userId, setNumber])

  console.log('Rendering RecommendedWeightRepsRPEDisplay')
  console.log('recommendedData:', recommendedData)
  console.log('isLoading:', isLoading)

  if (isLoading) {
    return <div className="mt-1 text-sm text-muted-foreground">Loading...</div>
  }

  if (!recommendedData || recommendedData.error) {
    return (
      <div className="mt-1 text-sm text-muted-foreground">
        No recommendation available
      </div>
    )
  }

  return (
    <div className="mt-1 flex items-center space-x-1 text-sm text-muted-foreground">
      <AiOutlineStar className="text-yellow-500" />
      <span>
        {field === 'rpe'
          ? recommendedData[field] ?? 'Not provided'
          : `${recommendedData[field]} ${field === 'weight' ? 'lbs' : 'reps'}`}
      </span>
    </div>
  )
}

export default RecommendedWeightRepsRPEDisplay
