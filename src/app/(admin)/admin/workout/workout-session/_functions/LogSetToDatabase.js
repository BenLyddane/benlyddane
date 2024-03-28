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
    // Check if the log already exists
    const existingLog = await checkExistingLog({
      workoutId,
      userId,
      exerciseId,
      workoutExerciseId,
      setNumber,
      workoutSessionId,
    });

    let loggedSet;

    if (existingLog) {
      // If the log exists, update the existing row
      const { data, error } = await supabase
        .from('workout_logs')
        .update({
          reps_completed: reps,
          weight_completed: weight,
          rpe,
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })
        .eq('id', existingLog.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating existing log:', error);
        toast({
          title: 'Error',
          description: `An error occurred while updating the existing log: ${error.message}. Please try again.`,
          variant: 'destructive',
        });
        return { error };
      }

      loggedSet = data;
    } else {
      // If the log doesn't exist, insert a new row
      const insertData = {
        workout_id: workoutId,
        user_id: userId,
        exercise_id: exerciseId,
        set_number: setNumber,
        reps_completed: reps,
        weight_completed: weight,
        rpe,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        workout_session_id: workoutSessionId,
        workout_exercise_id: workoutExerciseId,
      };

      const { data, error } = await supabase
        .from('workout_logs')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Error inserting new log:', error);
        toast({
          title: 'Error',
          description: `An error occurred while inserting a new log: ${error.message}. Please try again.`,
          variant: 'destructive',
        });
        return { error };
      }

      loggedSet = data;
    }

    toast({
      title: 'Set logged or updated',
      description: 'The set has been successfully logged or updated.',
      variant: 'success',
    });

    return { error: null, loggedSet };
  } catch (error) {
    console.error('Error in logOrUpdateSetToDatabase:', error);
    toast({
      title: 'Error',
      description: `An unexpected error occurred: ${error.message}. Please try again.`,
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