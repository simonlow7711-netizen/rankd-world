"use client"

import AmazonTreatment from "@/components/AmazonTreatment"
import InstagramTreatment from "@/components/InstagramTreatment"
import MapsTreatment from "@/components/MapsTreatment"
import SpotifyTreatment from "@/components/SpotifyTreatment"
import WebLinkTreatment from "@/components/WebLinkTreatment"
import YouTubeTreatment from "@/components/YouTubeTreatment"

import {
  getAmazonUrl
} from "@/utils/amazon"

import {
  getGoogleMapsEmbedUrl
} from "@/utils/googleMaps"

import {
  getInstagramPostUrl
} from "@/utils/instagram"

import {
  getSpotifyEmbed
} from "@/utils/spotify"

import {
  getYouTubeVideoId
} from "@/utils/youtube"

type EntryEmbedsProps = {
  url?: string | null
  name: string
}

export default function EntryEmbeds({
  url,
  name
}: EntryEmbedsProps) {

  if (!url) {
    return null
  }

  const youtubeId =
    getYouTubeVideoId(url)

  const mapsUrl =
    getGoogleMapsEmbedUrl(url)

  const spotify =
    getSpotifyEmbed(url)

  const amazonUrl =
    getAmazonUrl(url)

  const instagramPostUrl =
    getInstagramPostUrl(url)

  const hasSpecific =
    Boolean(
      youtubeId ||
      mapsUrl ||
      spotify ||
      amazonUrl ||
      instagramPostUrl
    )

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

      {
        !hasSpecific && (
          <WebLinkTreatment
            url={url}
            name={name}
          />
        )
      }
    </div>
  )
}
