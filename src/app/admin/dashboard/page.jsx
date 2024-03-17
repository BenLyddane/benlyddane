import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function page() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/')
  }

  return (
    <div>
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <p>test content</p>
      </main>
    </div>
  )
}
