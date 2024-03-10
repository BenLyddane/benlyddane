import { SimpleLayout } from '@/components/SimpleLayout'

export default function ComingSoon() {
  return (
    <SimpleLayout
      title="Coming Soon"
      intro="This page is under construction. Please check back later."
    >
      <div className="mt-8">
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
        I&apos;`m working hard to bring you more content. Stay tuned!
        </p>
      </div>
    </SimpleLayout>
  )
}
