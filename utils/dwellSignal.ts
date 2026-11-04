"use client"

import {
  useEffect
} from "react"

import {
  trackEvent
} from "@/utils/analytics"


export function useDwellSignal(
  event: string,
  metadata: Record<string, unknown>
) {

  const rankingId =
    metadata.rankingId

  useEffect(
    () => {

      const started =
        Date.now()

      let sent =
        false

      const send = () => {
        if (sent) {
          return
        }

        const seconds =
          Math.round(
            (Date.now() - started) /
            1000
          )

        if (seconds < 2) {
          return
        }

        sent = true

        void trackEvent(
          event,
          {
            ...metadata,
            seconds
          }
        )
      }

      window.addEventListener(
        "pagehide",
        send
      )

      return () => {
        window.removeEventListener(
          "pagehide",
          send
        )

        send()
      }

    },
    [
      event,
      rankingId
    ]
  )

}
