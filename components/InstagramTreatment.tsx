"use client"

import {
  useState
} from "react"

import FitEmbed from "@/components/FitEmbed"

type InstagramTreatmentProps = {
  url: string | null
  name: string
}

const INSTAGRAM_WIDTH = 326
const INSTAGRAM_HEIGHT = 540

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
          max-w-full
          items-center
          justify-between
          rounded-[22px]
          border
          border-black/10
          bg-[#F7F4EE]
          px-4
          py-3.5
          text-sm
          font-bold
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
        max-w-full
        overflow-hidden
        rounded-[22px]
        border
        border-black/10
        bg-[#F7F4EE]
      "
    >
      <FitEmbed
        width={INSTAGRAM_WIDTH}
        height={INSTAGRAM_HEIGHT}
        allowUpscale
      >
        <iframe
          title={`${name} on Instagram`}
          src={`${url}embed/`}
          width={INSTAGRAM_WIDTH}
          height={INSTAGRAM_HEIGHT}
          className="
            block
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
      </FitEmbed>

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
          "
        >
          Open ↗
        </a>
      </figcaption>
    </figure>
  )
}
