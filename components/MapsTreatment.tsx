"use client"

import {
  getGoogleMapsEmbedUrl
} from "@/utils/googleMaps"

type MapsTreatmentProps = {
  url?: string | null
  name: string
}

export default function MapsTreatment({
  url,
  name
}: MapsTreatmentProps) {

  const embedUrl =
    getGoogleMapsEmbedUrl(url ?? undefined)

  if (!embedUrl || !url) {
    return null
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
        shadow-[0_14px_32px_rgba(0,0,0,0.08)]
      "
    >
      <div
        className="
          relative
          h-[240px]
          w-full
          overflow-hidden
          bg-[#EAE3EC]
          sm:h-[280px]
        "
      >
        <iframe
          title={`Map showing ${name}`}
          src={embedUrl}
          className="
            h-full
            w-full
            max-w-full
            border-0
          "
          loading="lazy"
        />
      </div>

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
          Maps
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
          Open map ↗
        </a>
      </figcaption>
    </figure>
  )
}
