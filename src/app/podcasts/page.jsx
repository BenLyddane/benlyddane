'use client'
import React from 'react'
import { CardBody, CardContainer, CardItem } from '@/components/3d-card'
import Link from 'next/link'
import Image from 'next/image'

import Thursdinner from '@/images/podcasts/Thursdinner.png'
import ElevinMin from '@/images/podcasts/11minuteconstruction.png'

const InterestCard = ({ href, label, srcImage }) => (
  <CardContainer className="inter-var">
    <CardBody className="group/card relative h-auto w-auto rounded-xl border border-black/[0.1] bg-gray-50 p-6 sm:w-[30rem] dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1]">
      <Link href={href}>
        <CardItem
          translateZ="10"
          className="text-xl font-bold text-neutral-600 dark:text-cyan-500"
        >
          {label}
        </CardItem>
      </Link>
      <CardItem
        translateZ="20"
        rotateX={5}
        rotateZ={-2}
        className="mt-4 w-full"
      >
        <Image
          src={srcImage}
          height="1000"
          width="1000"
          className="h-100 w-full rounded-xl object-cover group-hover/card:shadow-xl"
          alt={`${label} thumbnail`}
        />
      </CardItem>
      <div className="mt-20 flex items-center justify-between">
        <Link href={href}>
          <CardItem
            translateZ={5}
            translateX={-10}
            as="button"
            className="rounded-xl px-4 py-2 text-xs font-normal dark:text-white"
          >
            Learn More →
          </CardItem>
        </Link>
      </div>
    </CardBody>
  </CardContainer>
)

export default function Interests() {
  const interests = [
    {
      href: 'https://11minuteconstruction.com',
      label: '11 Minute Construction',
      srcImage: ElevinMin,
    },
    {
      href: 'https://thursdinner.com',
      label: 'Thursdinner',
      srcImage: Thursdinner,
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-wrap justify-center gap-2">
        {interests.map((interest) => (
          <div key={interest.href} className="">
            <InterestCard {...interest} />
          </div>
        ))}
      </div>
    </div>
  )
}
