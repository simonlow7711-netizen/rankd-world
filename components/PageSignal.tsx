"use client"

import {
  useEffect
} from "react"

import {
  trackEvent
} from "@/utils/analytics"


type PageSignalProps = {
  event: string
  metadata?: Record<string, unknown>
}


export default function PageSignal({
  event,
  metadata
}: PageSignalProps) {

  useEffect(
    () => {
      void trackEvent(
        event,
        metadata ?? {}
      )
    },
    [
      event
    ]
  )

  return null
}
