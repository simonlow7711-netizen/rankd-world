"use client"

import {
  getSpotifyEmbed
} from "@/utils/spotify"

type SpotifyTreatmentProps = {
  url?: string | null
  name: string
}

export default function SpotifyTreatment({
  url,
  name
}: SpotifyTreatmentProps) {

  const embed =
    getSpotifyEmbed(url)

  if (!embed || !url) {
    return null
  }

  const compact =
    embed.type === "track" ||
    embed.type === "episode"

  return (
    <figure
      className="
        mx-auto
        mt-5
        w-full
        max-w-xl
        overflow-hidden
        rounded-[22px]
        border
        border-black/10
        bg-[#191414]
        shadow-[0_14px_32px_rgba(0,0,0,0.12)]
      "
    >
      <iframe
        src={embed.embedUrl}
        title={`Listen to ${name} on Spotify`}
        className="
          block
          w-full
          border-0
        "
        height={compact ? 152 : 352}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
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
            text-white/45
          "
        >
          Spotify
        </span>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            text-xs
            font-bold
            text-white/80
            transition
            hover:text-white
          "
        >
          Listen ↗
        </a>
      </figcaption>
    </figure>
  )
}
