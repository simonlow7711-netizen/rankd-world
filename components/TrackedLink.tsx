"use client"

import Link from "next/link"

import {
  ComponentProps
} from "react"

import {
  trackEvent
} from "@/utils/analytics"


type TrackedLinkProps = ComponentProps<typeof Link> & {
  event: string
  eventProps?: Record<string, unknown>
}


export default function TrackedLink({
  event,
  eventProps,
  onClick,
  ...props
}: TrackedLinkProps) {

  return (
    <Link
      {...props}
      onClick={clickEvent => {
        void trackEvent(
          event,
          eventProps ?? {}
        )

        onClick?.(
          clickEvent
        )
      }}
    />
  )
}
