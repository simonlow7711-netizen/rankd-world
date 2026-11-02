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

  const height =
    compact ? 152 : 352

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
        bg-[#191414]
      "
    >
      <div
        className="
          relative
          w-full
          min-w-0
          overflow-hidden
          bg-[#191414]
        "
        style={{
          height
        }}
      >
        <iframe
          src={embed.embedUrl}
          title={`Listen to ${name} on Spotify`}
          className="
            absolute
            inset-0
            h-full
            w-full
            min-w-0
            max-w-full
            border-0
          "
          style={{
            width: "100%",
            minWidth: 0,
            maxWidth: "100%",
            height: "100%"
          }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
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
          "
        >
          Listen ↗
        </a>
      </figcaption>
    </figure>
  )
}
