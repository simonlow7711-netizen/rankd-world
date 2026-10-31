"use client"

import AmazonTreatment from "@/components/AmazonTreatment"
import InstagramTreatment from "@/components/InstagramTreatment"
import MapsTreatment from "@/components/MapsTreatment"
import SpotifyTreatment from "@/components/SpotifyTreatment"
import YouTubeTreatment from "@/components/YouTubeTreatment"

import {
  getInstagramPostUrl
} from "@/utils/instagram"

type EntryEmbedsProps = {
  url?: string | null
  name: string
}

export default function EntryEmbeds({
  url,
  name
}: EntryEmbedsProps) {

  const instagramPostUrl =
    getInstagramPostUrl(url)

  return (
    <div
      className="
        flex
        w-full
        min-w-0
        max-w-full
        flex-col
        items-center
        overflow-x-hidden
      "
    >
      <YouTubeTreatment
        url={url}
        name={name}
      />

      <MapsTreatment
        url={url}
        name={name}
      />

      <SpotifyTreatment
        url={url}
        name={name}
      />

      <AmazonTreatment
        url={url}
        name={name}
      />

      {
        instagramPostUrl && (
          <InstagramTreatment
            url={instagramPostUrl}
            name={name}
          />
        )
      }
    </div>
  )
}
