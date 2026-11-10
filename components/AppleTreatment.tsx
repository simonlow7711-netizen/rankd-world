"use client"

import FitEmbed from "@/components/FitEmbed"

import {
  getAppleEmbed
} from "@/utils/appleMedia"

type AppleTreatmentProps = {
  url?: string | null
  name: string
}

export default function AppleTreatment({
  url,
  name
}: AppleTreatmentProps) {

  const embed =
    getAppleEmbed(url)

  if (!embed || !url) {
    return null
  }

  const height =
    embed.type === "song" ||
    embed.type === "episode"
      ? 175
      : embed.service === "podcasts"
        ? 240
        : 450

  const label =
    embed.service === "podcasts"
      ? "Apple Podcasts"
      : "Apple Music"

  return (
    <figure
      className="
        isolate
        mx-auto
        mt-5
        w-full
        min-w-0
        max-w-full
        overflow-hidden
        rounded-[22px]
        border
        border-black/10
        bg-black
      "
    >
      <FitEmbed
        width={400}
        height={height}
        fill
      >
        <iframe
          src={embed.embedUrl}
          title={`Listen to ${name} on ${label}`}
          className="
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
          allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
          loading="lazy"
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
            text-white/45
          "
        >
          {label}
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
