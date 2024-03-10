'use client'
import Image from 'next/image'
import React from 'react'
import { CardBody, CardContainer, CardItem } from '@/components/3d-card'
import image1 from '@/images/logos/FrogLogoPic.png'
import Link from 'next/link'

export default function Work() {
  return (
    <CardContainer className="inter-var">
      <CardBody className="group/card relative h-auto w-auto rounded-xl border border-black/[0.1] bg-gray-50 p-6 sm:w-[30rem] dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]">
        <Link href="https://www.specfrog.com">
          <CardItem
            translateZ="10"
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            SpecFrog.com
          </CardItem>
        </Link>
        <CardItem
          as="p"
          translateZ="15"
          className="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-300"
        >
          AI Assistants and GPTs for Construction Companies
        </CardItem>
        <CardItem
          translateZ="20"
          rotateX={5}
          rotateZ={-2}
          className="mt-4 w-full"
        >
          <Link href="https://www.specfrog.com/signup">
            <Image
              src={image1}
              height="1000"
              width="1000"
              className="h-60 w-full rounded-xl object-cover group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </Link>
        </CardItem>

        <div className="mt-20 flex items-center justify-between">
          <Link href="https://www.specfrog.com/signup">
            <CardItem
              translateZ={5}
              translateX={-10}
              as="button"
              className="rounded-xl px-4 py-2 text-xs font-normal dark:text-white"
            >
              Free Trial →
            </CardItem>
          </Link>
          <Link href="https://www.specfrog.com/signup">
            <CardItem
              translateZ={5}
              translateX={10}
              as="button"
              className="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-black"
            >
              Sign up
            </CardItem>
          </Link>
        </div>
      </CardBody>
    </CardContainer>
  )
}
