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
 
      } catch (error) {
        console.error('Error:', error)
      }
    }

    run()
  }, [])

  return (
    <SimpleLayout
      title="You're already subsribed!"
      intro="If you need to unsubscribe, please use one of the links in the emails I send you. Thanks!"
    />
  )
}
