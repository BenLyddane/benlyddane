import { createClient } from '@/utils/supabase/client'
import { ToastClose, ToastDescription, ToastTitle } from '@/components/ui/toast'

export const handleDeleteWorkout = async (
  workoutId,
  setCurrentWorkout,
  setWorkoutExercises,
  setWorkouts,
  workouts,
  toast,
) => {
  if (workoutId) {
    console.log('Deleting workout with ID:', workoutId)

    try {
      const supabase = createClient()

      // Delete the workout
      const { data, error } = await supabase
        .from('workouts')
        .delete()
        .eq('id', workoutId)

      console.log('Delete operation result:', data)

      if (error) {
        console.error('Error deleting workout:', error)
        toast({
          variant: 'destructive',
          title: <ToastTitle>Error</ToastTitle>,
          description: (
            <ToastDescription>
              Failed to delete the workout. Please try again later.
            </ToastDescription>
          ),
          action: <ToastClose />,
        })
      } else {
        console.log('Workout deleted successfully')

        // Check if related records were deleted
        const { data: workoutExercisesData, error: workoutExercisesError } =
          await supabase
            .from('workout_exercises')
            .select('*')
            .eq('workout_id', workoutId)

        const { data: workoutSessionsData, error: workoutSessionsError } =
          await supabase
            .from('workout_sessions')
            .select('*')
            .eq('workout_id', workoutId)

        const { data: workoutLogsData, error: workoutLogsError } =
          await supabase
            .from('workout_logs')
            .select('*')
            .eq('workout_id', workoutId)

        if (workoutExercisesError || workoutSessionsError || workoutLogsError) {
          console.error('Error checking related records:', {
            workoutExercisesError,
            workoutSessionsError,
            workoutLogsError,
          })
          toast({
            variant: 'destructive',
            title: <ToastTitle>Error</ToastTitle>,
            description: (
              <ToastDescription>
                The workout was deleted, but there was an error checking related
                records.
              </ToastDescription>
            ),
            action: <ToastClose />,
          })
        } else {
          const relatedRecordsDeleted =
            workoutExercisesData.length === 0 &&
            workoutSessionsData.length === 0 &&
            workoutLogsData.length === 0

          if (relatedRecordsDeleted) {
            toast({
              title: <ToastTitle>Success</ToastTitle>,
              description: (
                <ToastDescription>
                  The workout and all related records were deleted successfully.
                </ToastDescription>
              ),
              action: <ToastClose />,
            })
          } else {
            toast({
              title: <ToastTitle>Warning</ToastTitle>,
              description: (
                <ToastDescription>
                  The workout was deleted, but some related records could not be
                  deleted automatically.
                </ToastDescription>
              ),
              action: <ToastClose />,
            })
          }
        }

        setCurrentWorkout(null)
        setWorkoutExercises([])
        setWorkouts(workouts.filter((w) => w.id !== workoutId))
      }
    } catch (error) {
      console.error('Error deleting workout:', error)
      toast({
        variant: 'destructive',
        title: <ToastTitle>Error</ToastTitle>,
        description: (
          <ToastDescription>
            An unexpected error occurred while deleting the workout. Please try
            again later.
          </ToastDescription>
        ),
        action: <ToastClose />,
      })
    }
  } else {
    console.warn('No workoutId provided')
    toast({
      variant: 'destructive',
      title: <ToastTitle>Error</ToastTitle>,
      description: (
        <ToastDescription>No workout selected to delete.</ToastDescription>
      ),
      action: <ToastClose />,
    })
  }
}
