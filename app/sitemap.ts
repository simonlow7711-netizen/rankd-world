import type {
  MetadataRoute
} from "next"


import {
  getAllRankings
} from "@/utils/supabaseRankings"


import {
  categories
} from "@/utils/categories"


import {
  categoryToSlug
} from "@/utils/categorySlug"


const SITE_URL =
  "https://rankd.world"


export default async function sitemap(): Promise<
  MetadataRoute.Sitemap
> {


  const rankings =
    await getAllRankings()


  const latestRankingDate =

    (rankings ?? [])

      .map(

        ranking =>

          ranking.createdAt
            ? new Date(
                ranking.createdAt
              )
            : null

      )

      .filter(

        (
          date
        ): date is Date =>

          date !== null

      )

      .sort(

        (
          a,
          b
        ) =>

          b.getTime()
          -
          a.getTime()

      )[0]


  const categoryUrls =

    categories.map(

      category => ({

        url:
          `${SITE_URL}/category/${categoryToSlug(
            category
          )}`,

        lastModified:
          latestRankingDate
            ?? new Date(),

        changeFrequency:
          "daily" as const,

        priority:
          0.8

      })

    )


  const rankingUrls =

    (rankings ?? [])

      .map(

        ranking => ({

          url:
            `${SITE_URL}/rank/${ranking.id}`,

          lastModified:
            ranking.createdAt
              ? new Date(
                  ranking.createdAt
                )
              : undefined,

          changeFrequency:
            "weekly" as const,

          priority:
            0.7

        })

      )


  return [

    {

      url:
        SITE_URL,

      lastModified:
        latestRankingDate
        ?? new Date(),

      changeFrequency:
        "daily",

      priority:
        1

    },


    {

      url:
        `${SITE_URL}/categories`,

      lastModified:
        latestRankingDate
        ?? new Date(),

      changeFrequency:
        "weekly",

      priority:
        0.9

    },


    {

      url:
        `${SITE_URL}/explore`,

      lastModified:
        latestRankingDate
        ?? new Date(),

      changeFrequency:
        "daily",

      priority:
        0.9

    },


    ...categoryUrls,


    ...rankingUrls

  ]

}