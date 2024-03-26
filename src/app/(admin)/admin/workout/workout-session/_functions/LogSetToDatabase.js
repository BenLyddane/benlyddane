'use client'
import { createClient } from '@/utils/supabase/client'

const logOrUpdateSetToDatabase = async ({
  workoutId,
  userId,
  exerciseId,
  workoutExerciseId,
  setNumber,
  reps,
  weight,
  rpe,
  workoutSessionId,
  toast,
}) => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('workout_logs')
      .upsert({
        workout_id: workoutId,
        user_id: userId,
        exercise_id: exerciseId,
        workout_exercise_id: workoutExerciseId,
        set_number: setNumber,
        reps_completed: reps,
        weight_completed: weight,
        rpe,
        started_at: new Date().toISOString(),
        workout_session_id: workoutSessionId,
      })
      .eq('workout_id', workoutId)
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .eq('workout_exercise_id', workoutExerciseId)
      .eq('set_number', setNumber)
      .eq('workout_session_id', workoutSessionId)
      .select();

    if (error) {
      console.error('Error logging or updating set:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while logging or updating the set. Please try again.',
        variant: 'destructive',
      });
      return { error };
    }

    toast({
      title: 'Set logged or updated',
      description: 'The set has been successfully logged or updated.',
      variant: 'success',
    });

    return { data };
  } catch (error) {
    console.error('Error in logOrUpdateSetToDatabase:', error);
    toast({
      title: 'Error',
      description: 'An unexpected error occurred. Please try again.',
      variant: 'destructive',
    });
    return { error };
  }
};


const checkExistingLog = async ({
  workoutId,
  userId,
  exerciseId,
  workoutExerciseId,
  setNumber,
  workoutSessionId,
}) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('workout_id', workoutId)
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .eq('workout_exercise_id', workoutExerciseId)
    .eq('set_number', setNumber)
    .eq('workout_session_id', workoutSessionId)
    .limit(1)
    .single();

  if (error) {
    console.error('Error checking existing log:', error);
    return null;
  }

  return data;
};

export { logOrUpdateSetToDatabase, checkExistingLog };