import {
  unstable_cache
} from "next/cache"

import {
  getRecentAnalyticsEvents
} from "@/utils/rankingEngagement"

import {
  getPublishedPhotoRankds
} from "@/utils/photoRankds"

import {
  getRankingSitemapEntries,
  getRankingSummaries
} from "@/utils/supabaseRankings"


const listingCache = {
  revalidate: 300,
  tags: [
    "rankings"
  ]
}


export const getCachedRankingSummaries =
  unstable_cache(
    getRankingSummaries,
    [
      "ranking-summaries"
    ],
    listingCache
  )


export const getCachedRecentAnalyticsEvents =
  unstable_cache(
    getRecentAnalyticsEvents,
    [
      "recent-analytics-events"
    ],
    listingCache
  )


export const getCachedPublishedPhotoRankds =
  unstable_cache(
    getPublishedPhotoRankds,
    [
      "published-photo-rankds"
    ],
    listingCache
  )


export const getCachedRankingSitemapEntries =
  unstable_cache(
    getRankingSitemapEntries,
    [
      "ranking-sitemap"
    ],
    listingCache
  )
