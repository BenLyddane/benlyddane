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

  // Fetch the latest log for the specified set number
  const { data: latestLog, error: latestLogError } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('workout_exercise_id', workoutExerciseId)
    .eq('user_id', userId)
    .eq('set_number', setNumber)
    .order('started_at', { ascending: false })
    .limit(1);

  if (latestLogError) {
    console.error('Error fetching latest log for set:', latestLogError);
    return {
      weight: workoutExercise.weight,
      reps: workoutExercise.min_reps,
      rpe: 7,
      error: 'Failed to fetch latest log for set',
    };
  }

  console.log('Latest log:', latestLog);

  let recommendedWeight = workoutExercise.weight;
  let recommendedReps = workoutExercise.min_reps;
  let recommendedRPE = 7; // Default RPE if no logs are available or for first progression

  if (latestLog && latestLog.length > 0) {
    const log = latestLog[0];
    console.log('Log details:', log);
    recommendedRPE = log.rpe;

    // Adjust RPE based on last performance
    if (log.reps_completed >= workoutExercise.max_reps && log.rpe <= 5) {
      // If reps completed were at or above the max and RPE was low,
      // increase the weight and reset reps to the minimum
      const increaseBy = workoutExercise.weight >= 50 ? 5 : 2.5; // Increase by 5 lbs for weights >= 50 lbs, else 2.5 lbs
      recommendedWeight = calculateNextWeight(log.weight_completed, increaseBy);
      console.log('Recommended weight (max reps, low RPE):', recommendedWeight);
      recommendedReps = workoutExercise.min_reps;
      recommendedRPE = 7; // Reset RPE to default
    } else if (log.reps_completed === workoutExercise.min_reps && log.rpe >= 8) {
      // If reps completed were equal to the minimum and RPE was high,
      // decrease the weight to the nearest valid increment
      const decreasedWeight = log.weight_completed * 0.95;
      recommendedWeight = decreasedWeight >= 50
        ? Math.floor(decreasedWeight / 5) * 5
        : Math.floor(decreasedWeight / 2.5) * 2.5;
      console.log('Recommended weight (min reps, high RPE):', recommendedWeight);
      recommendedReps = log.reps_completed;
      recommendedRPE = log.rpe - 1; // Decrease RPE by 1
    } else if (
      log.reps_completed >= workoutExercise.min_reps &&
      log.reps_completed <= workoutExercise.max_reps
    ) {
      // If reps completed were within the target range (including max reps),
      // maintain the weight and try to increase reps by 1
      recommendedWeight = log.weight_completed;
      console.log('Recommended weight (within target range):', recommendedWeight);
      recommendedReps = Math.min(log.reps_completed + 1, workoutExercise.max_reps);
      recommendedRPE = log.rpe; // Maintain the same RPE
    }
  }

  console.log('Recommended weight:', recommendedWeight);
  console.log('Recommended reps:', recommendedReps);
  console.log('Recommended RPE:', recommendedRPE);

  return { weight: recommendedWeight, reps: recommendedReps, rpe: recommendedRPE };
};

export default getRecommendedWeightRepsRPE;