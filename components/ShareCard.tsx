"use client"

import ProfileIdentity from "@/components/ProfileIdentity"

type Props = {
  username: string
  rankings: {
    length: number
  }
}

export default function ShareCard({
  username,
  rankings
}: Props) {

  return (
    <ProfileIdentity
      displayName={
        `${username}'s RANKD`
      }
      username={username}
      rankingCount={
        rankings.length
      }
      kicker="RANKD / SHARE"
      tagline="Discover my Top 7 everything."
    />
  )

}
