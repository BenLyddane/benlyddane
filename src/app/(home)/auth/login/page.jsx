import Image from 'next/image'
import { redirect } from 'next/navigation'
import { login, signup } from '@/app/(home)/auth/actions/actions'
import loginpic from '@/images/login.png'
import { createClient } from '@/utils/supabase/server'

export default async function LoginPage() {
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (!error && data?.user) {
    redirect('/admin')
  }

  return (
    <div className="flex min-h-screen items-center justify-center py-16">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div className="flex flex-col items-center justify-center lg:items-end">
            <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-lg ring-1 ring-zinc-100 dark:bg-zinc-800 dark:ring-zinc-800">
              <h1 className="pb-8 text-center text-3xl font-bold text-zinc-800 dark:text-zinc-100">
                Welcome Back
              </h1>
              <form>
                <div className="pb-6">
                  <label
                    htmlFor="email"
                    className="block pb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="block w-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-cyan-500 focus:ring-cyan-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div className="pb-6">
                  <label
                    htmlFor="password"
                    className="block pb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="block w-full rounded-lg border border-zinc-300 bg-zinc-50 p-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-cyan-500 focus:ring-cyan-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                    required
                  />
                </div>
                <div className="flex flex-col items-center sm:flex-row sm:justify-between">
                  <button
                    type="submit"
                    formAction={login}
                    className="mb-4 w-full rounded-lg bg-cyan-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-cyan-600 focus:outline-none focus:ring-4 focus:ring-cyan-300 sm:mb-0 sm:w-auto dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800"
                  >
                    Log in
                  </button>
                  {/* SignUp Button Commented out for Live Site, only login available for admin */}
                  {/* <button
                    type="button"
                    onClick={signup}
                    className="w-full rounded-lg bg-zinc-800 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-zinc-900 focus:outline-none focus:ring-4 focus:ring-zinc-300 sm:ml-4 sm:w-auto dark:bg-zinc-600 dark:hover:bg-zinc-700 dark:focus:ring-zinc-800"
                  >
                    Sign up
                  </button> */}
                </div>
              </form>
            </div>
          </div>
          <div className="hidden lg:flex lg:items-center lg:justify-start">
            <div className="relative">
              <Image
                src={loginpic}
                alt="Login Picture"
                className="rounded-2xl shadow-2xl"
                width={500}
                height={500}
                quality={100}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
              <div className="absolute inset-0 rounded-2xl shadow-inner"></div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
