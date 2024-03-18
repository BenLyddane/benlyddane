import { createClient } from '@/utils/supabase/server'
import HabitTrackerClient from './HabitTrackerClient'

const HabitTrackerPage = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please log in to access the habit tracker.</div>
  }

  try {
    const { data: habits, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching habits:', error)
      return <div>Error fetching habits. Please try again later.</div>
    }

    return <HabitTrackerClient initialHabits={habits || []} />
  } catch (error) {
    console.error('Error fetching habits:', error)
    return <div>Error fetching habits. Please try again later.</div>
  }
}

export default HabitTrackerPage
