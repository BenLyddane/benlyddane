'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import ExerciseTable from './_components/ExerciseTable'
import getRecommendedSets from './_functions/RecommendedSets'

const SessionExerciseList = ({
  workoutExercises,
  currentWorkoutSession,
  setTimeRemaining,
  updateWorkoutExercises,
}) => {
  const [inputValues, setInputValues] = useState({})
  const [exercises, setExercises] = useState([])
  const [currentSetIndex, setCurrentSetIndex] = useState({})
  const [recommendedSets, setRecommendedSets] = useState({})
  const { toast } = useToast()

  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: exercisesData, error: exercisesError } = await supabase
        .from('exercises')
        .select('*')

      if (exercisesError) {
        toast({
          title: 'Error fetching exercises',
          description: exercisesError.message,
          variant: 'destructive',
        })
      } else {
        setExercises(exercisesData)
      }

      const calculatedRecommendedSets = await Promise.all(
        workoutExercises.map(async (workoutExercise) => {
          const recommendedSetsCount = await getRecommendedSets({
            workoutId: currentWorkoutSession.workout_id,
            userId: currentWorkoutSession.user_id,
          })
          return [workoutExercise.id, recommendedSetsCount]
        }),
      )

      setRecommendedSets(Object.fromEntries(calculatedRecommendedSets))
    }

    fetchData()
  }, [
    workoutExercises,
    currentWorkoutSession.user_id,
    currentWorkoutSession.workout_id,
    supabase,
    toast,
  ])

  const handleInputChange = (workoutExerciseId, setNumber, field, value) => {
    setInputValues((prevValues) => ({
      ...prevValues,
      [`${workoutExerciseId}-${setNumber}-${field}`]: value,
    }))
  }

  return (
    <>

      {workoutExercises
        .filter((exercise) => exercise !== null && exercise !== undefined)
        .sort((a, b) => {
         
          return (a?.order || 0) - (b?.order || 0)
        })
        .map((workoutExercise) => {
        
          const exerciseData = exercises.find(
            (e) => e.id === workoutExercise?.exercise_id,
          )

          return (
            <div key={workoutExercise.id} className="mb-8">
              <h3 className="mb-4 flex items-center text-xl font-bold">
                {exerciseData ? exerciseData.name : 'Exercise Name'}
                {recommendedSets[workoutExercise.id] && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    (Recommended Sets: {recommendedSets[workoutExercise.id]})
                  </span>
                )}
              </h3>
              <ExerciseTable
                workoutExercise={workoutExercise}
                currentWorkoutSession={currentWorkoutSession}
                currentSetIndex={currentSetIndex}
                handleInputChange={handleInputChange}
                updateWorkoutExercises={updateWorkoutExercises}
                recommendedSets={recommendedSets[workoutExercise.id]}
                inputValues={inputValues}
              />
            </div>
          )
        })}
    </>
  )
}

export default SessionExerciseList
