import { createClient } from '@/utils/supabase/server'
import HabitTrackerClient from './HabitTrackerClient'
import HabitCompletionGraph from './habit_records'

const HabitTrackerPage = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please log in to access the habit tracker.</div>
  }

  return (
    <>
      <HabitTrackerClient />
      <HabitCompletionGraph />
    </>
  )
}

export default HabitTrackerPage
