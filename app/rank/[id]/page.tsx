import type {
  Metadata
} from "next"


import {
  notFound
} from "next/navigation"


import {
  getSupabaseRanking
} from "@/utils/supabaseRankings"


import {
  formatRankingTitle
} from "@/utils/rankingTitle"


import {
  Ranking
} from "@/types/ranking"


import RankClient from "./RankClient"


const SITE_URL =
  "https://www.rankd.world"


type Props = {

  params: Promise<{
    id: string
  }>

}


export async function generateMetadata(

  {
    params

  }: Props

): Promise<Metadata> {


  const {
    id
  } =
    await params


  const ranking =
    await getSupabaseRanking(
      id
    )


  if (!ranking) {

    return {

      title:
        "RANKD | Top 7 everything"

    }

  }


  const title =
    formatRankingTitle(
      ranking.title
    )


  const description =
    ranking.description
    ||
    `Discover ${title} on RANKD.`


  const rankingUrl =
    `${SITE_URL}/rank/${ranking.id}`


  const imageUrl =
    `${SITE_URL}/rank/${ranking.id}/opengraph-image`


  return {

    title:
      `${title} | RANKD`,

    description:
      description,

    alternates: {

      canonical:
        rankingUrl

    },

    openGraph: {

      type:
        "website",

      url:
        rankingUrl,

      title:
        `${title} | RANKD`,

      description:
        description,

      siteName:
        "RANKD",

      locale:
        "en_GB",

      images: [

        {

          url:
            imageUrl,

          width:
            1200,

          height:
            630,

          alt:
            `${title} | RANKD`

        }

      ]

    },

    twitter: {

      card:
        "summary_large_image",

      title:
        `${title} | RANKD`,

      description:
        description,

      images: [

        {

          url:
            imageUrl,

          width:
            1200,

          height:
            630,

          alt:
            `${title} | RANKD`

        }

      ]

    }

  }

}


export default async function RankPage(

  {

    params

  }: Props

) {


  const {
    id

  } =
    await params


  const ranking =
    await getSupabaseRanking(
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
    ranking.description
    ||
    `Discover ${title} on RANKD.`


  const rankingUrl =
    `${SITE_URL}/rank/${ranking.id}`


  const sortedItems =

    [...ranking.items]

      .sort(

        (a, b) =>

          a.position -
          b.position

      )


  const structuredData = {

    "@context":
      "https://schema.org",

    "@graph": [

      {

        "@type":
          "WebSite",

        "@id":
          `${SITE_URL}/#website`,

        url:
          SITE_URL,

        name:
          "RANKD",

        description:
          "The world's Top 7 everything.",

        inLanguage:
          "en-GB"

      },


      {

        "@type":
          "Organization",

        "@id":
          `${SITE_URL}/#organization`,

        name:
          "RANKD",

        url:
          SITE_URL

      },


      {

        "@type":
          "WebPage",

        "@id":
          `${rankingUrl}/#webpage`,

        url:
          rankingUrl,

        name:
          `${title} | RANKD`,

        description:
          description,

        isPartOf: {

          "@id":
            `${SITE_URL}/#website`

        },

        about: {

          "@id":
            `${SITE_URL}/#organization`

        },

        inLanguage:
          "en-GB"

      },


      {

        "@type":
          "ItemList",

        "@id":
          `${rankingUrl}/#ranking`,

        name:
          title,

        description:
          description,

        url:
          rankingUrl,

        numberOfItems:
          sortedItems.length,

        itemListOrder:
          "https://schema.org/ItemListOrderAscending",

        itemListElement:

          sortedItems.map(

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

    ]

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

        initialRanking={
          ranking
        }

      />

    </>

  )

}