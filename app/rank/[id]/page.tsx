import type {
  Metadata
} from "next"


import {
  notFound
} from "next/navigation"


import {
  getRankingTeaserUrl,
  getSupabaseRankingServer
} from "@/utils/supabaseRankingServer"


import {
  formatRankingTitle
} from "@/utils/rankingTitle"


import RankClient from "./RankClient"

import {
  sharePreviewImage,
  sharePreviewUrl
} from "@/utils/ogImage"


import {
  SITE_URL,
  indexableRobots
} from "@/utils/siteUrl"


type Props = {
  params: Promise<{
    id: string
  }>
  searchParams: Promise<{
    teaser?: string
  }>
}


export async function generateMetadata(
  {
    params
  }: Props
): Promise<Metadata> {

  const {
    id
  } = await params


  const ranking =
    await getSupabaseRankingServer(
      id
    )


  if (!ranking) {

    return {

      title:
        "RANKD — The World's Top 7 Everything",

      description:
        "Discover, create and debate the world's Top 7 on RANKD.",

      robots: {
        index:
          false,
        follow:
          false
      }

    }

  }


  const title =
    formatRankingTitle(
      ranking.title
    )


  const description =
    ranking.description ||
    `Discover ${title} on RANKD.`


  const canonicalUrl =
    `${SITE_URL}/rank/${id}`


  const ogImageUrl =
    sharePreviewUrl({
      id
    })


  const teaserUrl =
    await getRankingTeaserUrl(
      id
    )


  return {

    title,

    description,


    alternates: {

      canonical:
        canonicalUrl

    },


    openGraph: {

      type:
        teaserUrl
          ? "video.other"
          : "article",

      url:
        canonicalUrl,

      siteName:
        "RANKD",

      title:
        `${title} | RANKD`,

      description,

      locale:
        "en_GB",

      images: [

        sharePreviewImage(
          `${title} | RANKD`,
          ogImageUrl
        )

      ],

      ...(
        teaserUrl
          ? {
              videos: [
                {
                  url: teaserUrl,
                  secureUrl: teaserUrl,
                  type: "video/mp4",
                  width: 1080,
                  height: 1920
                }
              ]
            }
          : {}
      )

    },


    twitter: {

      card:
        "summary_large_image",

      title:
        `${title} | RANKD`,

      description,

      images: [
        ogImageUrl
      ]

    },

    robots:
      indexableRobots

  }

}


export default async function RankPage(
  {
    params,
    searchParams
  }: Props
) {

  const {
    id
  } = await params

  const {
    teaser
  } = await searchParams


  const ranking =
    await getSupabaseRankingServer(
      id
    )


  if (!ranking) {

    notFound()

  }


  const title =
    formatRankingTitle(
      ranking.title
    )


  const description =
    ranking.description ||
    `Discover ${title} on RANKD.`


  const canonicalUrl =
    `${SITE_URL}/rank/${id}`


  const structuredData = {

    "@context":
      "https://schema.org",

    "@type":
      "ItemList",

    "@id":
      `${canonicalUrl}#ranking`,

    url:
      canonicalUrl,

    name:
      title,

    description,

    numberOfItems:
      ranking.items.length,

    itemListElement:
      ranking.items.map(
        item => ({

          "@type":
            "ListItem",

          position:
            item.position,

          name:
            item.name

        })
      )

  }


  return (

    <>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            JSON.stringify(
              structuredData
            )
        }}
      />


      <RankClient
        id={id}
        initialRanking={ranking}
        openTeaser={
          teaser === "1"
        }
      />

    </>

  )

}