import { createClient } from '@/utils/supabase/server'

const HabitTrackerServer = async () => {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  try {
    const { data: habits, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching habits:', error)
      return {
        props: {
          initialHabits: [],
        },
      }
    }

    return {
      props: {
        initialHabits: habits || [],
      },
    }
  } catch (error) {
    console.error('Error fetching habits:', error)
    return {
      props: {
        initialHabits: [],
      },
    }
  }
}

export default HabitTrackerServer
