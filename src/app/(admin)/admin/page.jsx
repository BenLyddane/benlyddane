import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { AdminCalendar } from '@/app/(admin)/admin/Calendar'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { FaUsers, FaChartBar, FaTasks } from 'react-icons/fa'

export default async function Admin() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/')
  }

  return (
    <div>
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="p-8">
          Hey and welcome to your admin dashboard! Here we will display the
          output from your trackers so you can a view on how you are doing
          across disciplines.
        </div>
      </main>
    </div>
  )
}
