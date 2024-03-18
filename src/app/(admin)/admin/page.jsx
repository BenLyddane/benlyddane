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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-semibold">Welcome, Admin!</h2>
            <p className="text-gray-600">
              Here&apos;s an overview of your dashboard:
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center rounded-lg bg-blue-500 p-4 text-white">
                <FaUsers className="mr-4 text-3xl" />
                <div>
                  <p className="text-lg font-semibold">Total Users</p>
                  <p className="text-2xl">1,234</p>
                </div>
              </div>
              <div className="flex items-center rounded-lg bg-green-500 p-4 text-white">
                <FaChartBar className="mr-4 text-3xl" />
                <div>
                  <p className="text-lg font-semibold">Monthly Revenue</p>
                  <p className="text-2xl">$12,345</p>
                </div>
              </div>
              <div className="flex items-center rounded-lg bg-yellow-500 p-4 text-white">
                <FaTasks className="mr-4 text-3xl" />
                <div>
                  <p className="text-lg font-semibold">Pending Tasks</p>
                  <p className="text-2xl">10</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-2xl font-semibold">Recent Activity</h2>
            {/* Add recent activity content */}
          </div>
        </div>
        <div className="mt-8">
          <AdminCalendar />
        </div>
      </main>
    </div>
  )
}
