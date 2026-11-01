"use client"

import ProfileIdentity from "@/components/ProfileIdentity"

type Props = {
  username: string
  rankings: {
    length: number
  }
}

export default function ProfileCard({
  username,
  rankings
}: Props) {

  return (
    <ProfileIdentity
      displayName={username}
      username={username}
      rankingCount={
        rankings.length
      }
      tagline="My RANKD identity"
      shareable
    />
  )

}
