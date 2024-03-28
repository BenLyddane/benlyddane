import { createClient } from '@/utils/supabase/client'

export const fetchData = async (table, select, filters = {}) => {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .match(filters)

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}