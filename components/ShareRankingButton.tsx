"use client"

import ShareButton from "@/components/ShareButton"

type ShareRankingButtonProps = {
  rankingId: string
  title: string
}

export default function ShareRankingButton({
  rankingId,
  title
}: ShareRankingButtonProps) {

  return (
    <ShareButton
      url={`/rank/${rankingId}`}
      title={title}
      eventProps={{
        rankingId
      }}
      align="center"
    />
  )

}
