import { Footer } from '@/components/Footer'
import { AdminHeader } from '@/components/AdminHeader'
import { createClient } from '@/utils/supabase/server'

export async function AdminLayout({ children }) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/')
  }
  return (
    <>
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      <div className="relative flex w-full flex-col">
        <AdminHeader email={data.user.email} />
        <main className="flex-auto">{children}</main>
        <Footer />
      </div>
    </>
  )
}
