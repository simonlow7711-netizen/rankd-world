"use client"

import {
  useEffect,
  useState
} from "react"

import {
  useRouter
} from "next/navigation"

import Link from "next/link"

import {
  Ranking
} from "@/types/ranking"

import RankingResponse from "@/components/RankingResponse"

import RankingEngagement from "@/components/RankingEngagement"

import {
  getRankingEngagement,
  RankingEngagementData
} from "@/utils/rankingEngagement"

import {
  trackEvent
} from "@/utils/analytics"

import {
  formatRankingTitle
} from "@/utils/rankingTitle"

import ShareButton from "@/components/ShareButton"

import RevealTopCover from "@/components/RevealTopCover"

import EditionChrome from "@/components/EditionChrome"

import EditionHeader, {
  EditionMark,
  EditionTitle
} from "@/components/EditionHeader"

import RankingDescription from "@/components/RankingDescription"

import {
  getCategoryTheme
} from "@/utils/categoryTheme"


type RankingCardProps = {

  ranking: Ranking

  discoveryReason?: string

}


type RankingTheme = {

  card: string

  cardColor: string

  text: string

  textColor: string

  accent: string

  accentColor: string

  muted: string

  mutedColor: string

  border: string

  borderColor: string

  itemBorder: string

  categoryLabel: string

  secondaryLabel: string

  title: string

  index: string

}


function getTheme(
  category?: string
): RankingTheme {

  const theme =
    getCategoryTheme(
      category
    )

  return {
    card:
      theme.paperClass,
    cardColor:
      theme.paper,
    text:
      "text-black",
    textColor:
      "#111111",
    accent:
      theme.accentClass,
    accentColor:
      theme.accent,
    muted:
      "text-black/50",
    mutedColor:
      "#6B6B6B",
    border:
      "border-black",
    borderColor:
      "#111111",
    itemBorder:
      "divide-black/10",
    categoryLabel:
      theme.name,
    secondaryLabel:
      theme.label,
    title:
      `text-3xl md:text-4xl ${theme.titleClass}`,
    index:
      theme.index
  }

}


function formatLocationCountry(
  country?: string
): string {

  const countryCodes: Record<string, string> = {

    "United Kingdom":
      "UK",

    "Philippines":
      "PH"

  }


  return (
    countryCodes[country ?? ""] ??
    country ??
    ""
  )

}


function splitLongFormItemText(
  text: string
): string[] {

  return text
    .split(
      /\r?\n\s*\r?\n|\s{2,}/
    )
    .map(
      paragraph =>
        paragraph.trim()
    )
    .filter(
      Boolean
    )

}


export default function RankingCard({

  ranking,

  discoveryReason

}: RankingCardProps) {


  const router =
    useRouter()


  const [
    response,
    setResponse
  ] =
  useState<
    "rankd" |
    "rerankd" |
    null
  >(
    null
  )


  const [
    engagement,
    setEngagement
  ] =
  useState<RankingEngagementData>({

    views: 0,

    rankd: 0,

    rerankd: 0

  })


  useEffect(() => {

    let cancelled = false


    async function loadEngagement() {

      const data =
        await getRankingEngagement(
          ranking.id
        )


      if (!cancelled) {

        setEngagement(
          data
        )

      }

    }


    loadEngagement()


    return () => {

      cancelled = true

    }

  }, [ranking.id])


  const [
    topItemRevealed,
    setTopItemRevealed
  ] =
    useState(
      false
    )


  useEffect(() => {

    setTopItemRevealed(
      false
    )

  }, [ranking.id])


  const sortedItems =

    [...ranking.items]

      .sort(

        (a, b) =>

          a.position -
          b.position

      )


  const theme =
    getTheme(
      ranking.category
    )

  const edition =
    getCategoryTheme(
      ranking.category
    )


  const locationName =
    ranking.location?.name?.trim() ??
    ""

  const locationCity =
    ranking.location?.city?.trim() ??
    ""

  const locationState =
    ranking.location?.state?.trim() ??
    ""

  const showLocationCity =
    Boolean(
      locationCity
    ) &&
    locationCity.toLowerCase() !==
      locationName.toLowerCase()
  function handleRankd() {

    if (response !== null) {

      return

    }


    trackEvent(

      "ranking_rankd",

      {

        rankingId:
          ranking.id

      }

    )


    setResponse(
      "rankd"
    )


    setEngagement(

      current => ({

        ...current,

        rankd:
          current.rankd + 1

      })

    )

  }


  function handleRerankd() {

    trackEvent(

      "ranking_rerank_started",

      {

        rankingId:
          ranking.id

      }

    )


    const items =

      sortedItems

        .map(

          item =>
            item.name

        )

        .join(
          "|"
        )


    const rootId =

      ranking.rootId ??
      ranking.id


    router.push(

      `/create?title=${encodeURIComponent(

        ranking.title

      )}&category=${encodeURIComponent(

        ranking.category

      )}&items=${encodeURIComponent(

        items

      )}&parentId=${encodeURIComponent(

        ranking.id

      )}&rootId=${encodeURIComponent(

        rootId

      )}`

    )

  }


  const isLongFormRanking =

    ranking.id ===
    "da31e636-d2b4-495a-a38c-fd755e7f689b"
    ||
    ranking.id ===
    "c3950c12-3929-42e6-ae79-1983bc2ccbce"


  return (

    <article

      className={`
        rankd-edition
        group
        relative
        min-w-0
        overflow-hidden
        h-full
        p-7
        md:p-8
        rounded-[28px]
        border
        ${theme.card}
        ${theme.text}
        ${theme.border}
      `}

    >

      <EditionChrome
        theme={
          edition
        }
      />

      <Link

        href={
          `/rank/${ranking.id}`
        }

        className="
          relative
          z-10
          block
          text-left
        "

      >

        <EditionHeader
          theme={
            edition
          }
          category={
            ranking.category
          }
          bleed="card"
        >

        {
          discoveryReason && (

            <p

              className={`
                ${theme.accent}
                uppercase
                tracking-[0.25em]
                text-[10px]
                font-black
                mb-5
              `}

            >

              <EditionMark
                theme={
                  edition
                }
              >

                {
                  discoveryReason
                }

              </EditionMark>

            </p>

          )
        }


        <div

          className={`
            flex
            items-center
            justify-start
            gap-4
            pb-5
            border-b
            ${theme.border}
          `}

        >

          <p

            className={`
              ${theme.accent}
              uppercase
              tracking-[0.25em]
              text-[10px]
              font-black
            `}

          >

            <EditionMark
              theme={
                edition
              }
            >

              {theme.index} · RANKD

            </EditionMark>

          </p>


          <span

            className={`
              ${theme.accent}
              text-[9px]
              uppercase
              tracking-[0.2em]
              font-black
            `}

          >

            <EditionMark
              theme={
                edition
              }
            >

              {
                theme.secondaryLabel
              }

            </EditionMark>

          </span>

        </div>


        <p

          className={`
            mt-5
            ${theme.accent}
            uppercase
            tracking-[0.2em]
            text-[9px]
            font-black
          `}

        >

          <EditionMark
            theme={
              edition
            }
          >

            {
              theme.categoryLabel
            }

          </EditionMark>

        </p>


        <h3

          className={`
            mt-2
            max-w-full
            font-black
            text-balance
            hyphens-none
            ${theme.title}
          `}

        >

          <EditionTitle
            theme={
              edition
            }
          >

            {
              formatRankingTitle(
                ranking.title
              )
            }

          </EditionTitle>

        </h3>

        </EditionHeader>


        <RankingDescription
          text={
            ranking.description
          }
          mediaUrl={
            ranking.mediaUrl
          }
          name={
            formatRankingTitle(
              ranking.title
            )
          }
          className={`
            relative
            z-10
            mt-6
            max-w-xl
            whitespace-pre-wrap
            leading-relaxed
            ${theme.muted}
          `}
        />


        {
          ranking.location && (

            <div

              className="
                mx-auto
                mt-3
                inline-flex
                max-w-full
                min-w-0
                items-center
                justify-center
                gap-2
                rounded-full
                border
                px-3
                py-1.5
                text-[9px]
                font-black
                uppercase
                tracking-[0.16em]
              "

              style={{

                borderColor:
                  "rgba(17,17,17,0.12)",

                backgroundColor:
                  "transparent",

                color:
                  `${theme.mutedColor}`

              }}

            >

              <span

                className="
                  relative
                  flex
                  h-2.5
                  w-2.5
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                "

                style={{

                  borderColor:
                    theme.accentColor

                }}

                aria-hidden="true"

              >

                <span

                  className="
                    h-1
                    w-1
                    rounded-full
                  "

                  style={{

                    backgroundColor:
                      theme.accentColor

                  }}

                />

              </span>


              <span

                className="
                  min-w-0
                  break-words
                "

              >

                {
                  [
                    locationName,
                    showLocationCity
                      ? locationCity
                      : "",
                    locationState,
                    formatLocationCountry(
                      ranking.location.country
                    )
                  ]
                    .filter(Boolean)
                    .join(" · ")
                }

              </span>

            </div>

          )
        }

      </Link>


        <div

          className={`
            relative
            z-10
            mt-8
            border-t
            pt-5
            ${theme.border}
          `}

        >

          <div

            className="
              mb-4
              flex
              items-center
              justify-center
              gap-4
            "

          >

            <p

              className={`
                ${theme.accent}
                uppercase
                tracking-[0.25em]
                text-[10px]
                font-black
              `}

            >

              TOP 7

            </p>


            <span

              className="
                text-[9px]
                uppercase
                tracking-[0.2em]
                font-black
                opacity-40
              "

            >

              In order

            </span>

          </div>


          <div

            className={`
              divide-y
              ${theme.itemBorder}
            `}

          >

            {
              sortedItems.map(

                item => {

                  const row = (

                  <div

                    className="
                      flex
                      flex-col
                      items-center
                      gap-2
                      py-3.5
                      text-center
                    "

                  >

                    <span

                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-[11px]
                        font-black
                        tracking-[0.08em]
                      `}

                      style={{
                        border:
                          item.position === 1
                            ? `2px solid ${theme.accentColor}`
                            : `1px solid ${theme.accentColor}55`,
                        color:
                          theme.accentColor,
                        backgroundColor:
                          "transparent"
                      }}

                    >

                      {
                        String(item.position).padStart(2, "0")
                      }

                    </span>


                    {
                      isLongFormRanking
                        ? (

                            <div
                              className="
                                min-w-0
                                flex-1
                              "
                            >

                              {
                                splitLongFormItemText(
                                  item.name
                                )
                                  .slice(
                                    0,
                                    2
                                  )
                                  .map(
                                    (
                                      paragraph,
                                      index
                                    ) => (

                                      <p
                                        key={
                                          `${ranking.id}-${item.position}-${index}`
                                        }
                                        className={`
                                          ${
                                            index === 0
                                              ? `
                                                  text-base
                                                  md:text-lg
                                                  font-black
                                                  leading-tight
                                                `
                                              : `
                                                  mt-3
                                                  text-sm
                                                  md:text-base
                                                  font-normal
                                                  leading-relaxed
                                                  opacity-60
                                                  line-clamp-2
                                                `
                                          }
                                        `}
                                      >

                                        {
                                          paragraph
                                        }

                                      </p>

                                    )
                                  )
                              }

                            </div>

                          )
                        : (

                            <span

                              className="
                                min-w-0
                                font-black
                                leading-tight
                              "

                            >

                              {
                                item.name
                              }

                            </span>

                          )
                    }

                  </div>

                  )

                  if (
                    item.position === 1
                  ) {

                    return (

                      <RevealTopCover
                        key={
                          `${ranking.id}-${item.position}`
                        }
                        revealed={
                          topItemRevealed
                        }
                        onReveal={() => {
                          setTopItemRevealed(
                            true
                          )
                        }}
                        accent={
                          theme.accentColor
                        }
                        ink={
                          theme.textColor
                        }
                      >
                        {row}
                      </RevealTopCover>

                    )

                  }

                  return (

                    <div
                      key={
                        `${ranking.id}-${item.position}`
                      }
                    >
                      {row}
                    </div>

                  )

                }

              )
            }

          </div>


          <div

            className={`
              mt-5
              flex
              flex-col
              items-center
              border-t
              pt-5
              ${theme.border}
            `}

          >

            <RankingEngagement

              views={
                engagement.views
              }

              rankd={
                engagement.rankd
              }

              rerankd={
                engagement.rerankd
              }

              accentColor={
                theme.accentColor
              }

              textColor={
                theme.textColor
              }

              mutedColor={
                theme.mutedColor
              }

              borderColor={
                theme.borderColor
              }

              cardColor={
                theme.cardColor
              }

            />

          </div>


        </div>


      <div

        className={`
          relative
          z-10
          mt-5
          pt-5
          border-t
          ${theme.border}
        `}

      >

        <RankingResponse

          onRankd={
            handleRankd
          }

          onRerankd={
            handleRerankd
          }

          accent={
            theme.accent
          }

          text={
            theme.text
          }

          muted={
            theme.muted
          }

          border={
            theme.border
          }

          card={
            "bg-transparent"
          }

          accentColor={
            theme.accentColor
          }

          textColor={
            theme.textColor
          }

          mutedColor={
            theme.mutedColor
          }

          borderColor={
            theme.borderColor
          }

          cardColor={
            "transparent"
          }

        />

        <div
          className="
            mt-4
            flex
            justify-center
          "
        >
          <ShareButton
            url={
              `/rank/${ranking.id}`
            }
            title={
              formatRankingTitle(
                ranking.title
              )
            }
            eventProps={{
              rankingId:
                ranking.id
            }}
            compact
            align="center"
          />
        </div>

      </div>

    </article>

  )

}