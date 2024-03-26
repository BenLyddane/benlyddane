import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const getRecommendedSets = async ({ workoutId, userId }) => {
  try {
    const { data: lastTwoSessions, error: lastTwoSessionsError } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('workout_id', workoutId)
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(2)

    if (lastTwoSessionsError) {
      console.error('Error fetching last two sessions:', lastTwoSessionsError)
      return 3 // Default to 3 sets if there's an error
    }

    if (lastTwoSessions.length < 2) {
      return 3 // Default to 3 sets if there are not enough sessions
    }

    // Determine the average RPE of the last two sessions
    const lastSessionTotalRPE = lastTwoSessions[0].reduce((sum, log) => sum + log.rpe, 0);
    const lastSessionAverageRPE = lastSessionTotalRPE / lastTwoSessions[0].length;
    const prevSessionTotalRPE = lastTwoSessions[1].reduce((sum, log) => sum + log.rpe, 0);
    const prevSessionAverageRPE = prevSessionTotalRPE / lastTwoSessions[1].length;

    // Determine if a deload is needed based on performance over the last two sessions
    const isDeloadNeeded =
      lastTwoSessions[0].some(log => log.rpe >= 9 && log.reps_completed < log.max_reps) &&
      lastTwoSessions[1].some(log => log.rpe >= 9 && log.reps_completed < log.max_reps);

    // Determine the recommended sets based on the average RPE and deload check
    let recommendedSets;
    if (isDeloadNeeded) {
      // Deload by reducing the number of sets by 50%
      recommendedSets = Math.floor(lastTwoSessions[0].length / 2);
    } else {
      if (lastSessionAverageRPE <= 7) {
        // If average RPE is low to moderate, increase the number of sets by 1-2
        recommendedSets = lastTwoSessions[0].length + Math.floor(Math.random() * 2) + 1;
      } else if (lastSessionAverageRPE > 7 && lastSessionAverageRPE <= 9) {
        // If average RPE is high, maintain the number of sets
        recommendedSets = lastTwoSessions[0].length;
      } else {
        // If average RPE is very high, decrease the number of sets by 1-2
        recommendedSets = lastTwoSessions[0].length - (Math.floor(Math.random() * 2) + 1);
      }
    }

    // Ensure the recommended sets stay within the 2-10 range
    recommendedSets = Math.max(2, Math.min(10, recommendedSets));

    return recommendedSets;
  } catch (error) {
    console.error('Error in getRecommendedSets:', error.message);
    return 3; // Default to 3 sets if there's an error
  }
};

export default getRecommendedSets;