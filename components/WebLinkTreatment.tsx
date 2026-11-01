"use client"

import {
  useEffect,
  useState
} from "react"

type WebLinkTreatmentProps = {
  url: string
  name: string
}

type Unfurl = {
  title: string | null
  image: string | null
  site: string | null
}

export default function WebLinkTreatment({
  url,
  name
}: WebLinkTreatmentProps) {

  const [
    preview,
    setPreview
  ] =
    useState<Unfurl>({
      title: null,
      image: null,
      site: null
    })

  const [
    imageFailed,
    setImageFailed
  ] =
    useState(false)

  useEffect(() => {

    let cancelled = false

    async function load() {
      try {
        const response =
          await fetch(
            `/api/unfurl?url=${encodeURIComponent(url)}`,
            {
              signal:
                AbortSignal.timeout(8000)
            }
          )

        if (!response.ok) {
          return
        }

        const data =
          await response.json() as Unfurl

        if (!cancelled) {
          setPreview(data)
        }
      } catch {
        // Keep the link card without metadata.
      }
    }

    load()

    return () => {
      cancelled = true
    }

  }, [url])

  let hostname =
    ""

  try {
    hostname =
      new URL(url).hostname.replace(
        /^www\./,
        ""
      )
  } catch {
    hostname =
      "Link"
  }

  const title =
    preview.title ||
    name

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="
        mx-auto
        mt-5
        flex
        w-full
        min-w-0
        max-w-full
        items-center
        gap-4
        overflow-hidden
        rounded-[22px]
        border
        border-black
        bg-[#F7F4EE]
        p-3.5
        pr-5
        text-left
        text-black
      "
    >

      <div
        className="
          flex
          h-[4.75rem]
          w-[4.75rem]
          shrink-0
          items-center
          justify-center
          overflow-hidden
          rounded-xl
          border
          border-black/10
          bg-[#F7F4EE]
        "
      >
        {
          preview.image &&
          !imageFailed ? (
            <img
              src={preview.image}
              alt=""
              className="
                h-full
                w-full
                object-cover
              "
              loading="lazy"
              onError={() => {
                setImageFailed(true)
              }}
            />
          ) : (
            <span
              className="
                px-2
                text-center
                text-[10px]
                font-black
                uppercase
                tracking-[0.16em]
                text-black/35
              "
            >
              Link
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
          {preview.site || hostname}
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
          {title}
        </p>

        <p
          className="
            mt-2
            text-sm
            font-bold
            text-[#FF6B35]
          "
        >
          Open ↗
        </p>
      </div>

    </a>
  )

}
