import { MailIcon } from '@/components/MailIcon'
import { Button } from './Button'
import { redirect } from 'next/navigation'
import client from '@mailchimp/mailchimp_marketing'

const apiKey = process.env.MAILCHIMP_API_KEY
const server = process.env.MAILCHIMP_SERVER
const audienceId = process.env.MAILCHIMP_AUDIENCE_ID

client.setConfig({
  apiKey: apiKey,
  server: server,
})

async function subscribe(data) {
  'use server'
  const email = data.get('email')
  if (!email) {
    throw new Error('Email is required')
  }
  let isAlreadySubscribed = false
  try {
    await client.lists.addListMember(audienceId, {
      email_address: email,
      status: 'subscribed',
    })
  } catch (err) {
    if (err.status === 400) {
      if (err.response.body.title === 'Member Exists') {
        // User is already subscribed
        isAlreadySubscribed = true
      } else if (err.response.body.title === 'Invalid Resource') {
        throw new Error(
          'You have recently signed up to multiple lists. Please try again later.',
        )
      } else {
        console.error('Failed to subscribe', err)
        throw new Error('Failed to subscribe. Please try again.')
      }
    } else {
      console.error('Failed to subscribe', err)
      throw new Error(
        'An error occurred while subscribing. Please try again later.',
      )
    }
  }
  redirect(isAlreadySubscribed ? '/already-subscribed' : '/thank-you')
}

function Newsletter() {
  return (
    <form
      action={subscribe}
      className="rounded-2xl border border-zinc-100 p-6 dark:border-zinc-700/40"
    >
      <h2 className="flex text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <MailIcon className="h-6 w-6 flex-none" />
        <span className="ml-3">Stay up to date</span>
      </h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Get notified when I publish something new, and unsubscribe at any time.
      </p>
      <div className="mt-6 flex">
        <input
          type="email"
          name="email"
          placeholder="Email address"
          aria-label="Email address"
          required
          className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10"
        />
        <Button type="submit" className="ml-4 flex-none">
          Join
        </Button>
      </div>
    </form>
  )
}

export default Newsletter
