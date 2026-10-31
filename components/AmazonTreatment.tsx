"use client"

import {
  useEffect,
  useState
} from "react"

import {
  getAmazonSearchQuery,
  getAmazonUrl
} from "@/utils/amazon"

type AmazonTreatmentProps = {
  url?: string | null
  name: string
}

export default function AmazonTreatment({
  url,
  name
}: AmazonTreatmentProps) {

  const amazonUrl =
    getAmazonUrl(url)

  const [coverId, setCoverId] =
    useState<number | null>(null)

  const [coverFailed, setCoverFailed] =
    useState(false)

  useEffect(() => {
    if (!amazonUrl) {
      setCoverId(null)
      return
    }

    let cancelled = false

    async function findCover() {
      try {
        const query =
          getAmazonSearchQuery(
            amazonUrl as string,
            name
          )

        const response = await fetch(
          `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=5&fields=cover_i,title`,
          {
            signal: AbortSignal.timeout(8000)
          }
        )

        if (!response.ok) {
          return
        }

        const data = await response.json()

        const result = data.docs?.find(
          (book: {
            cover_i?: number
          }) => book.cover_i
        )

        if (!cancelled && result?.cover_i) {
          setCoverId(result.cover_i)
          setCoverFailed(false)
        }
      } catch {
        // Keep the card without a cover.
      }
    }

    findCover()

    return () => {
      cancelled = true
    }
  }, [amazonUrl, name])

  if (!amazonUrl) {
    return null
  }

  return (
    <a
      href={amazonUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="
        mx-auto
        mt-5
        flex
        w-full
        max-w-xl
        items-center
        gap-4
        overflow-hidden
        rounded-[22px]
        border
        border-black/10
        bg-white
        p-3.5
        pr-5
        text-left
        text-black
        shadow-[0_12px_28px_rgba(0,0,0,0.06)]
        transition
        hover:-translate-y-0.5
        hover:shadow-[0_16px_36px_rgba(0,0,0,0.1)]
      "
    >
      <div
        className="
          flex
          h-[7.5rem]
          w-[5.25rem]
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-xl
          bg-[#F3EEE6]
        "
      >
        {
          coverId && !coverFailed ? (
            <img
              src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`}
              alt={`Cover of ${name}`}
              className="
                h-full
                w-full
                object-cover
              "
              loading="lazy"
              onError={() => {
                setCoverFailed(true)
              }}
            />
          ) : (
            <span
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.18em]
                text-black/35
              "
            >
              Book
            </span>
          )
        }
      </div>

      <div className="min-w-0 flex-1">
        <p
          className="
            text-[10px]
            font-black
            uppercase
            tracking-[0.2em]
            text-black/40
          "
        >
          Amazon
        </p>

        <p
          className="
            mt-1.5
            text-lg
            font-black
            leading-tight
            tracking-[-0.03em]
          "
        >
          {name}
        </p>

        <p
          className="
            mt-2
            text-sm
            font-bold
            text-[#FF6B35]
          "
        >
          View on Amazon ↗
        </p>
      </div>
    </a>
  )
}
