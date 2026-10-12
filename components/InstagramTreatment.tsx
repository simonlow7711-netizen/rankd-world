
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
      <div
        className="
          mt-4
        "
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex
            items-center
            gap-2
            border-b
            border-[#FF6B35]
            pb-1
            text-sm
            font-bold
            text-black
            transition
            hover:text-[#FF6B35]
          "
        >
          <span
            className="
              text-[#FF6B35]
            "
          >
            ↗
          </span>

          <span>
            View on Instagram
          </span>
        </a>
      </div>
    )
  }

  return (
    <div
      className="
        mt-4
        overflow-hidden
        rounded-2xl
        border
        border-black/10
        bg-white
      "
    >
      <iframe
        title={`${name} on Instagram`}
        src={`${url}embed/`}
        className="
          block
          h-[420px]
          w-full
          border-0
          sm:h-[540px]
        "
        loading="lazy"
        allowFullScreen
        onError={() => {
          setEmbedFailed(true)
        }}
      />

      <div
        className="
          flex
          items-center
          justify-between
          gap-3
          px-4
          py-3
        "
      >
        <span
          className="
            text-xs
            font-bold
            text-black/60
          "
        >
          INSTAGRAM
        </span>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            text-sm
            font-bold
            text-black
            transition
            hover:text-[#FF6B35]
          "
        >
          Open original ↗
        </a>
      </div>
    </div>
  )
}
