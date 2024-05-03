import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const calculateNextWeight = (currentWeight, increaseBy) => {
  const increasePercentage = 1.05;

  if (currentWeight < 50) {
    // Round to the nearest 2.5 lbs for weights below 50 lbs
    const increasedWeight = Math.floor(currentWeight * increasePercentage);
    const roundedWeight = Math.floor(increasedWeight / 2.5) * 2.5;
    return roundedWeight < 50 ? roundedWeight + increaseBy : Math.ceil(roundedWeight / 2.5) * 2.5;
  } else {
    // Round to the nearest 5 lbs for weights 50 lbs and above
    const increasedWeight = Math.floor(currentWeight * increasePercentage);
    const roundedWeight = Math.floor(increasedWeight / 5) * 5;
    return roundedWeight + increaseBy;
  }
};

const getRecommendedWeightRepsRPE = async ({ workoutExerciseId, userId, setNumber }) => {
  // Fetch the exercise details
  const { data: workoutExercise, error: workoutExerciseError } = await supabase
    .from('workout_exercises')
    .select('id, weight, min_reps, max_reps')
    .eq('id', workoutExerciseId)
    .single();

  if (workoutExerciseError || !workoutExercise) {
    console.error('Error fetching workout exercise details:', workoutExerciseError);
    return {
      weight: null,
      reps: null,
      rpe: null,
      error: 'Failed to fetch workout exercise details',
    };
  }

  console.log('Workout exercise details:', workoutExercise);

  // Fetch the latest two logs for the specified set number
  const { data: latestLogs, error: latestLogsError } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('workout_exercise_id', workoutExerciseId)
    .eq('user_id', userId)
    .eq('set_number', setNumber)
    .order('started_at', { ascending: false })
    .limit(2);

  if (latestLogsError) {
    console.error('Error fetching latest logs for set:', latestLogsError);
    return {
      weight: workoutExercise.weight,
      reps: workoutExercise.min_reps,
      rpe: 7,
      error: 'Failed to fetch latest logs for set',
    };
  }

  console.log('Latest logs:', latestLogs);

  let recommendedWeight = workoutExercise.weight;
  let recommendedReps = workoutExercise.min_reps;
  let recommendedRPE = 7; // Default RPE if no logs are available or for first progression

  if (latestLogs && latestLogs.length > 0) {
    const latestLog = latestLogs[0];
    console.log('Latest log details:', latestLog);
    recommendedRPE = latestLog.rpe;

    // Use the latest log as the baseline
    recommendedWeight = latestLog.weight_completed;
    recommendedReps = latestLog.reps_completed;

    // Adjust RPE based on last performance
    if (latestLog.reps_completed >= workoutExercise.max_reps && latestLog.rpe <= 7) {
      // If reps completed were at or above the max and RPE was 7 or lower,
      // increase the weight and reset reps to the minimum
      const increaseBy = workoutExercise.weight >= 50 ? 5 : 2.5; // Increase by 5 lbs for weights >= 50 lbs, else 2.5 lbs
      recommendedWeight = calculateNextWeight(latestLog.weight_completed, increaseBy);
      console.log('Recommended weight (max reps, RPE <= 7):', recommendedWeight);
      recommendedReps = workoutExercise.min_reps;
      recommendedRPE = 7; // Reset RPE to default
    } else if (latestLog.reps_completed === workoutExercise.min_reps && latestLog.rpe >= 9) {
      // If reps completed were equal to the minimum and RPE was 9 or higher,
      // decrease the weight to the nearest valid increment
      const decreasedWeight = latestLog.weight_completed * 0.95;
      recommendedWeight = decreasedWeight >= 50
        ? Math.floor(decreasedWeight / 5) * 5
        : Math.floor(decreasedWeight / 2.5) * 2.5;
      console.log('Recommended weight (min reps, RPE >= 9):', recommendedWeight);
      recommendedReps = latestLog.reps_completed;
      recommendedRPE = latestLog.rpe - 1; // Decrease RPE by 1
    } else if (
      latestLog.reps_completed >= workoutExercise.min_reps &&
      latestLog.reps_completed <= workoutExercise.max_reps
    ) {
      // If reps completed were within the target range (including max reps),
      // maintain the weight and try to increase reps by 1
      recommendedWeight = latestLog.weight_completed;
      console.log('Recommended weight (within target range):', recommendedWeight);
      recommendedReps = Math.min(latestLog.reps_completed + 1, workoutExercise.max_reps);
      recommendedRPE = latestLog.rpe; // Maintain the same RPE
    }

    // Check if there is a previous log to consider
    if (latestLogs.length > 1) {
      const previousLog = latestLogs[1];
      console.log('Previous log details:', previousLog);

      // Adjust recommendations based on the previous log
      // Add your logic here to consider the previous log and make adjustments
      // For example, you can compare the performance of the latest log with the previous log
      // and make further adjustments to the recommended weight, reps, and RPE accordingly.
    }
  }

  console.log('Recommended weight:', recommendedWeight);
  console.log('Recommended reps:', recommendedReps);
  console.log('Recommended RPE:', recommendedRPE);

  return { weight: recommendedWeight, reps: recommendedReps, rpe: recommendedRPE };
};

export default getRecommendedWeightRepsRPE;