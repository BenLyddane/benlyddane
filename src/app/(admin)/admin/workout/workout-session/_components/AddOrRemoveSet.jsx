'use client'
import { useState, useEffect } from 'react'
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'

const AddOrRemoveSet = ({
  workoutExerciseId,
  currentSets,
  updateWorkoutExercises,
  currentWorkoutSession,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoggedData, setHasLoggedData] = useState(false)
  const { toast } = useToast()

  const supabase = createClient()

  useEffect(() => {
    const checkLoggedData = async () => {
      if (currentWorkoutSession && currentWorkoutSession.id) {
        const { data, error } = await supabase
          .from('workout_logs')
          .select('*')
          .eq('workout_exercise_id', workoutExerciseId)
          .eq('workout_session_id', currentWorkoutSession.id)
          .eq('set_number', currentSets)

        if (error) {
          console.error('Error checking logged data:', error)
        } else {
          setHasLoggedData(data.length > 0)
        }
      }
    }

    checkLoggedData()
  }, [workoutExerciseId, currentWorkoutSession, currentSets, supabase])

  const updateSets = async (newSets) => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from('workout_exercises')
      .update({ sets: newSets })
      .eq('id', workoutExerciseId)
      .single()
    setIsLoading(false)
    if (error) {
      console.error('Error updating sets:', error)
      toast({
        title: 'Error updating sets',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      updateWorkoutExercises(workoutExerciseId, { sets: newSets })
      toast({
        title: 'Sets updated',
        description: 'The number of sets has been updated.',
        variant: 'success',
      })
    }
  }

  const addSet = () => {
    console.log('Adding set for workout exercise:', workoutExerciseId)
    updateSets(currentSets + 1)
  }

  const removeSet = () => {
    if (currentSets <= 1 || hasLoggedData) {
      toast({
        title: 'Cannot remove set',
        description:
          currentSets <= 1
            ? 'There must be at least one set for each exercise.'
            : 'Cannot remove a set that has logged data.',
        variant: 'destructive',
      })
      return
    }

    console.log('Removing set for workout exercise:', workoutExerciseId)
    updateSets(currentSets - 1)
  }

  return (
    <div className="flex items-center justify-end space-x-2">
      <span className="text-sm font-medium text-zinc-700">
        Sets: {currentSets}
      </span>
      <Button
        onClick={removeSet}
        disabled={isLoading || currentSets <= 1 || hasLoggedData}
        variant="ghost"
        className="text-zinc-500 hover:text-zinc-700"
      >
        <AiOutlineMinus className="h-4 w-4" />
      </Button>
      <Button
        onClick={addSet}
        disabled={isLoading}
        variant="ghost"
        className="text-zinc-500 hover:text-zinc-700"
      >
        <AiOutlinePlus className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default AddOrRemoveSet
