import type {
  Metadata
} from "next"


import {
  notFound
} from "next/navigation"


import {
  getSupabaseRankingServer
} from "@/utils/supabaseRankingServer"


import {
  formatRankingTitle
} from "@/utils/rankingTitle"


import RankClient from "./RankClient"


type Props = {
  params: Promise<{
    id:string
  }>
}


export async function generateMetadata(
  {
    params
  }:Props
):Promise<Metadata>{

  const {
    id
  } = await params


  const ranking =
    await getSupabaseRankingServer(
      id
    )


  if(!ranking){

    return {
      title:
        "RANKD | The world's Top 7 everything"
    }

  }


  const title =
    formatRankingTitle(
      ranking.title
    )


  const description =
    ranking.description ||
    `Discover ${title} on RANKD.`


  return {
    title:
      `${title} | RANKD`,
    description
  }

}


export default async function RankPage(
  {
    params
  }:Props
){

  const {
    id
  } = await params


  const ranking =
    await getSupabaseRankingServer(
      id
    )


  if(!ranking){

    notFound()

  }


  const title =
    formatRankingTitle(
      ranking.title
    )


  const description =
    ranking.description ||
    `Discover ${title} on RANKD.`


  const structuredData = {
    "@context":
      "https://schema.org",
    "@type":
      "ItemList",
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
      />

    </>
  )

}