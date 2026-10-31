"use client"

import {
  useState
} from "react"

type InstagramTreatmentProps = {
  url: string | null
  name: string
}

export default function InstagramTreatment({
  url,
  name
}: InstagramTreatmentProps) {

  const [embedFailed, setEmbedFailed] =
    useState(false)

  if (!url) {
    return null
  }

  if (embedFailed) {
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
          max-w-[min(100%,20.5rem)]
          items-center
          justify-between
          rounded-[22px]
          border
          border-black/10
          bg-white
          px-4
          py-3.5
          text-sm
          font-bold
          shadow-[0_12px_28px_rgba(0,0,0,0.06)]
          transition
          hover:text-[#FF6B35]
        "
      >
        <span>View on Instagram</span>
        <span aria-hidden="true">↗</span>
      </a>
    )
  }

  return (
    <figure
      className="
        mx-auto
        mt-5
        w-full
        min-w-0
        max-w-[min(100%,20.5rem)]
        overflow-hidden
        rounded-[22px]
        border
        border-black/10
        bg-white
        shadow-[0_14px_32px_rgba(0,0,0,0.08)]
      "
    >
      <iframe
        title={`${name} on Instagram`}
        src={`${url}embed/`}
        className="
          block
          h-[min(460px,70vh)]
          w-full
          max-w-full
          min-w-0
          border-0
          bg-[#FAFAFA]
        "
        loading="lazy"
        allowFullScreen
        scrolling="no"
        onError={() => {
          setEmbedFailed(true)
        }}
      />

      <figcaption
        className="
          flex
          items-center
          justify-between
          gap-3
          px-4
          py-2.5
        "
      >
        <span
          className="
            text-[10px]
            font-black
            uppercase
            tracking-[0.2em]
            text-black/40
          "
        >
          Instagram
        </span>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            text-xs
            font-bold
            text-black
            transition
            hover:text-[#FF6B35]
          "
        >
          Open ↗
        </a>
      </figcaption>
    </figure>
  )
}
