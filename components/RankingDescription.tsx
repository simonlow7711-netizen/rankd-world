"use client"

import EntryEmbeds from "@/components/EntryEmbeds"

import LinkText from "@/components/LinkText"


type RankingDescriptionProps = {
  text?: string | null
  mediaUrl?: string | null
  name: string
  className?: string
}


export default function RankingDescription({
  text,
  mediaUrl,
  name,
  className
}: RankingDescriptionProps) {

  const body =
    text?.trim() ??
    ""

  if (
    !body &&
    !mediaUrl
  ) {
    return null
  }

  return (
    <div
      className="
        w-full
        min-w-0
      "
    >
      {
        body && (
          <p className={className}>
            <LinkText
              text={body}
            />
          </p>
        )
      }

      {
        mediaUrl && (
          <EntryEmbeds
            url={mediaUrl}
            name={name}
          />
        )
      }
    </div>
  )

}
