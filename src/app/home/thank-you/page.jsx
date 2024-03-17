'use client'
import { useEffect } from 'react'
import { SimpleLayout } from '@/components/SimpleLayout'
const client = require('@mailchimp/mailchimp_marketing')

export default function ThankYou() {
  useEffect(() => {
    client.setConfig({
      apiKey: '',
      server: 'us22',
    })

    const run = async () => {
      try {
        const response = await client.lists.batchListMembers('list_id', {
          members: [{}],
        })
        console.log(response)
      } catch (error) {
        console.error('Error:', error)
      }
    }

    run()
  }, [])

  return (
    <SimpleLayout
      title="Thanks for subscribing."
      intro="I’ll send you an email any time I publish a new blog post, release a new project, or have anything interesting to share that I think you’d want to hear about. You can unsubscribe at any time, no hard feelings."
    />
  )
}
