"use client"

import {
  getYouTubeVideoId
} from "@/utils/youtube"

type YouTubeTreatmentProps = {
  url?: string | null
  name: string
}

export default function YouTubeTreatment({
  url,
  name
}: YouTubeTreatmentProps) {

  const videoId =
    getYouTubeVideoId(url ?? undefined)

  if (!videoId || !url) {
    return null
  }

  return (
    <figure
      className="
        mx-auto
        mt-5
        w-full
        max-w-xl
        overflow-hidden
        rounded-[22px]
        bg-black
        shadow-[0_18px_40px_rgba(0,0,0,0.18)]
      "
    >
      <div
        className="
          relative
          aspect-video
          w-full
          overflow-hidden
          bg-black
        "
      >
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={`Watch ${name} on YouTube`}
          className="
            absolute
            inset-0
            h-full
            w-full
            border-0
          "
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
          allowFullScreen
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
          YouTube
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
          Watch ↗
        </a>
      </figcaption>
    </figure>
  )
}
