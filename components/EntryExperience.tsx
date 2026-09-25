"use client"

import {
  useEffect,
  useMemo,
  useState
} from "react"

import Link from "next/link"

import {
  useRouter
} from "next/navigation"

import {
  Ranking
} from "@/types/ranking"

import {
  trackEvent
} from "@/utils/analytics"

import {
  formatRankingTitle
} from "@/utils/rankingTitle"

import RankingResponse from "@/components/RankingResponse"


type EntryExperienceProps = {
  rankings: Ranking[]
}


type ExperienceState =
  | "ranking"
  | "insight"


type CategoryTheme = {
  bg: string
  text: string
  accent: string
  muted: string
  border: string
  label: string
}


const categoryThemes: Record<
  string,
  CategoryTheme
> = {
  "Food & Drink": {
    bg: "#F3E8D8",
    text: "#211A16",
    accent: "#D96B35",
    muted: "#6E5545",
    border: "#211A16",
    label: "MENU / 07"
  },

  "Film & TV": {
    bg: "#ECEAE5",
    text: "#151515",
    accent: "#FF6B35",
    muted: "#686560",
    border: "#151515",
    label: "FRAME / 07"
  },

  Music: {
    bg: "#E9E3DE",
    text: "#211A1A",
    accent: "#C43D35",
    muted: "#746562",
    border: "#211A1A",
    label: "SIDE A / 07"
  },

  Sport: {
    bg: "#E7EBE5",
    text: "#101510",
    accent: "#E54B2F",
    muted: "#586058",
    border: "#101510",
    label: "MATCH / 07"
  },

  Gaming: {
    bg: "#E7ECE9",
    text: "#0E1416",
    accent: "#39A932",
    muted: "#59645F",
    border: "#0E1416",
    label: "PLAYER 1 / 07"
  },

  Travel: {
    bg: "#E0ECE8",
    text: "#123B36",
    accent: "#087D71",
    muted: "#58736F",
    border: "#123B36",
    label: "FIELD NOTES / 07"
  },

  Technology: {
    bg: "#E9EBE9",
    text: "#111820",
    accent: "#315AE8",
    muted: "#69737C",
    border: "#111820",
    label: "SYSTEM / 07"
  },

  Lifestyle: {
    bg: "#EEE8DE",
    text: "#29241E",
    accent: "#A45D3E",
    muted: "#766E64",
    border: "#29241E",
    label: "EDIT / 07"
  },

  Books: {
    bg: "#F1EBDD",
    text: "#30251D",
    accent: "#9B493D",
    muted: "#75695E",
    border: "#30251D",
    label: "PUBLISHING / 07"
  },

  "Art & Design": {
    bg: "#E9E6DF",
    text: "#151515",
    accent: "#B58B18",
    muted: "#68645C",
    border: "#151515",
    label: "CATALOGUE / 07"
  },

  Fashion: {
    bg: "#ECE3E9",
    text: "#231B22",
    accent: "#A52F68",
    muted: "#786773",
    border: "#231B22",
    label: "COLLECTION / 07"
  },

  Beauty: {
    bg: "#F1E5E3",
    text: "#2C1C1F",
    accent: "#C34E68",
    muted: "#856B70",
    border: "#2C1C1F",
    label: "EDIT / 07"
  },

  "Health & Fitness": {
    bg: "#E4EEE6",
    text: "#17251B",
    accent: "#16824D",
    muted: "#607467",
    border: "#17251B",
    label: "ENERGY / 07"
  },

  Business: {
    bg: "#E5E9EE",
    text: "#14202B",
    accent: "#245A91",
    muted: "#64717D",
    border: "#14202B",
    label: "BRIEFING / 07"
  },

  Science: {
    bg: "#E0EAEC",
    text: "#14272C",
    accent: "#157D8C",
    muted: "#61767C",
    border: "#14272C",
    label: "FIELD NOTES / 07"
  },

  History: {
    bg: "#E9E0CF",
    text: "#2D2419",
    accent: "#86502E",
    muted: "#766A5B",
    border: "#2D2419",
    label: "ARCHIVE / 07"
  },

  "Nature & Animals": {
    bg: "#E0E9DC",
    text: "#172418",
    accent: "#4C7D3F",
    muted: "#62715E",
    border: "#172418",
    label: "FIELD GUIDE / 07"
  },

  "Cars & Transport": {
    bg: "#E2E5E7",
    text: "#141B20",
    accent: "#C63D2E",
    muted: "#68737B",
    border: "#141B20",
    label: "ROAD / 07"
  },

  "Home & Garden": {
    bg: "#E9E7DD",
    text: "#25251E",
    accent: "#6E7C45",
    muted: "#707064",
    border: "#25251E",
    label: "LIVING / 07"
  },

  General: {
    bg: "#F7F4EE",
    text: "#000000",
    accent: "#FF6B35",
    muted: "#66615B",
    border: "#000000",
    label: "TOP 7"
  }
}


function getCategoryTheme(
  category?: string
) {
  return (
    categoryThemes[
      category ??
      "General"
    ] ??
    categoryThemes.General
  )
}


export default function EntryExperience({
  rankings
}: EntryExperienceProps) {

  const router =
    useRouter()


  const eligibleRankings =
    useMemo(
      () =>
        rankings.filter(
          ranking =>
            ranking.items &&
            ranking.items.length === 7
        ),
      [rankings]
    )


  const [
    rankingIndex,
    setRankingIndex
  ] =
    useState(
      0
    )


  const [
    state,
    setState
  ] =
    useState<ExperienceState>(
      "ranking"
    )


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
    topItemRevealed,
    setTopItemRevealed
  ] =
    useState(
      false
    )


  useEffect(() => {

    if (
      eligibleRankings.length <= 1
    ) {
      return
    }


    const randomIndex =
      Math.floor(
        Math.random() *
        eligibleRankings.length
      )


    setRankingIndex(
      randomIndex
    )

  }, [
    eligibleRankings.length
  ])


  const ranking =
    eligibleRankings[
      rankingIndex
    ]


  const nextRanking =
    useMemo(
      () => {

        if (
          !ranking
        ) {
          return null
        }


        const sameCategory =
          eligibleRankings.filter(
            candidate =>
              candidate.id !==
              ranking.id &&

              candidate.category ===
              ranking.category
          )


        if (
          sameCategory.length > 0
        ) {
          return sameCategory[0]
        }


        const otherRanking =
          eligibleRankings.find(
            candidate =>
              candidate.id !==
              ranking.id
          )


        return (
          otherRanking ??
          null
        )

      },
      [
        ranking,
        eligibleRankings
      ]
    )


  if (
    !ranking
  ) {

    return (

      <section
        className="
          min-h-[70vh]
          flex
          items-center
          justify-center
          px-6
          py-16
        "
      >

        <div
          className="
            max-w-xl
            text-center
          "
        >

          <p
            className="
              text-sm
              font-black
              uppercase
              tracking-[0.3em]
              text-[#FF6B35]
            "
          >
            RANKD
          </p>


          <h1
            className="
              mt-5
              text-5xl
              font-black
              leading-none
              tracking-[-0.06em]
              md:text-7xl
            "
          >
            Nothing to rank yet.
          </h1>


          <p
            className="
              mt-6
              text-lg
              text-black/50
            "
          >
            Create the first RANKD and
            start the conversation.
          </p>


          <button
            type="button"
            onClick={() =>
              router.push(
                "/create"
              )
            }
            className="
              mt-8
              rounded-full
              bg-black
              px-7
              py-4
              text-sm
              font-black
              text-white
              transition
              hover:bg-black/85
            "
          >
            Create a RANKD →
          </button>

        </div>

      </section>

    )
  }


  const theme =
    getCategoryTheme(
      ranking.category
    )


  function handleRankd() {

    trackEvent(
      "entry_rankd",
      {
        rankingId:
          ranking.id
      }
    )


    setResponse(
      "rankd"
    )


    setState(
      "insight"
    )

  }


  function handleRerankd() {

    trackEvent(
      "entry_rerankd",
      {
        rankingId:
          ranking.id
      }
    )


    const items =
      [...ranking.items]
        .sort(
          (a, b) =>
            a.position -
            b.position
        )
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


  function handleRevealTopItem() {

    setTopItemRevealed(
      true
    )

  }


  function viewNextRanking() {

    if (
      !nextRanking
    ) {

      router.push(
        "/explore"
      )

      return

    }


    trackEvent(
      "entry_next_ranking",
      {
        fromRankingId:
          ranking.id,

        toRankingId:
          nextRanking.id
      }
    )


    const nextIndex =
      eligibleRankings.findIndex(
        candidate =>
          candidate.id ===
          nextRanking.id
      )


    if (
      nextIndex === -1
    ) {

      router.push(
        `/rank/${nextRanking.id}`
      )

      return

    }


    setRankingIndex(
      nextIndex
    )


    setResponse(
      null
    )


    setTopItemRevealed(
      false
    )


    setState(
      "ranking"
    )

  }


  const sortedItems =
    [...ranking.items]
      .sort(
        (a, b) =>
          a.position -
          b.position
      )


  const perspectiveScore =
    Math.round(
      ranking.signals?.perspectiveScore ??
      0
    )


  const liveScore =
    Math.round(
      ranking.signals?.liveScore ??
      0
    )


  const insightScore =
    Math.min(
      100,
      Math.round(
        (
          perspectiveScore +
          Math.min(
            liveScore,
            100
          )
        ) /
        2
      )
    )


  const insight =
    insightScore >= 70

      ? {
          title:
            "You're joining a big debate.",

          description:
            "This ranking has strong signs of community interest and differing perspectives."
        }

      : insightScore >= 40

        ? {
            title:
              "This one could split opinion.",

            description:
              "There's a meaningful opportunity for different perspectives around this ranking."
          }

        : {
            title:
              "You're backing a clear opinion.",

            description:
              "This ranking currently shows relatively little evidence of competing perspectives."
          }


  return (

    <section
      className="
        min-h-screen
        px-5
        py-10
        md:px-8
        md:py-16
      "
      style={{
        backgroundColor:
          theme.bg,

        color:
          theme.text
      }}
    >

      <div
        className="
          mx-auto
          max-w-7xl
        "
      >

        {
          state === "ranking" && (

            <>

              <header
                className="
                  relative
                  mb-5
                  px-2
                  py-3
                  md:mb-7
                  md:px-4
                  md:py-5
                "
              >

                <div
                  className="
                    relative
                    z-10
                    max-w-4xl
                  "
                >

                  <p
                    className="
                      text-xs
                      font-black
                      uppercase
                      tracking-[0.3em]
                    "
                    style={{
                      color:
                        theme.accent
                    }}
                  >
                    RANKD / YOUR OPINION
                  </p>


                  <h1
                    className="
                      mt-3
                      max-w-3xl
                      text-4xl
                      font-black
                      leading-[0.88]
                      tracking-[-0.06em]
                      md:text-5xl
                      lg:text-6xl
                    "
                  >
                    Would you rank it differently?
                  </h1>


                  <div
                    className="
                      mt-4
                    "
                  >

                    <p
                      className="
                        text-base
                        font-medium
                        leading-relaxed
                        md:text-lg
                      "
                      style={{
                        color:
                          theme.muted
                      }}
                    >
                      See the Top 7.
                      Make your call.
                    </p>

                  </div>

                </div>

              </header>


              <article
                className="
                  relative
                  overflow-hidden
                  rounded-[32px]
                  border
                  md:rounded-[40px]
                "
                style={{
                  backgroundColor:
                    theme.bg,

                  color:
                    theme.text,

                  borderColor:
                    theme.border
                }}
              >

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-8
                    -top-24
                    select-none
                    text-[18rem]
                    font-black
                    leading-none
                    tracking-[-0.16em]
                    opacity-[0.06]
                    md:-right-12
                    md:-top-32
                    md:text-[28rem]
                  "
                  style={{
                    color:
                      theme.accent
                  }}
                  aria-hidden="true"
                >
                  7
                </div>


                <div
                  className="
                    relative
                    z-10
                    p-7
                    md:p-12
                    lg:p-16
                  "
                >

                  <div
                    className="
                      flex
                      flex-col
                      gap-7
                      border-b
                      pb-8
                      md:flex-row
                      md:items-start
                      md:justify-between
                    "
                    style={{
                      borderColor:
                        `${theme.border}1A`
                    }}
                  >

                    <div
                      className="
                        max-w-4xl
                      "
                    >

                      <p
                        className="
                          text-xs
                          font-black
                          uppercase
                          tracking-[0.28em]
                        "
                        style={{
                          color:
                            theme.accent
                        }}
                      >
                        RANKD / {
                          theme.label
                        }
                      </p>


                      <h2
                        className="
                          mt-4
                          text-4xl
                          font-black
                          leading-[0.86]
                          tracking-[-0.06em]
                          md:text-6xl
                          lg:text-7xl
                        "
                      >
                        {
                          formatRankingTitle(
                            ranking.title
                          )
                        }
                      </h2>

                    </div>


                    <div
                      className="
                        shrink-0
                        self-start
                        rounded-full
                        px-5
                        py-2.5
                        text-xs
                        font-black
                        uppercase
                        tracking-[0.16em]
                      "
                      style={{
                        backgroundColor:
                          `${theme.text}0A`,

                        color:
                          theme.text
                      }}
                    >
                      TOP 7
                    </div>

                  </div>


                  {
                    ranking.description && (

                      <p
                        className="
                          mt-7
                          max-w-3xl
                          text-lg
                          font-medium
                          leading-relaxed
                          md:text-xl
                        "
                        style={{
                          color:
                            theme.muted
                        }}
                      >
                        {
                          ranking.description
                        }
                      </p>

                    )
                  }


                  <div
                    className="
                      mt-10
                    "
                  >

                    {
                      sortedItems.map(
                        item => {

                          const isTopItem =
                            item.position === 1


                          if (
                            isTopItem
                          ) {

                            return (

                              <div
                                key={
                                  `${ranking.id}-${item.position}`
                                }
                                className="
                                  relative
                                  overflow-hidden
                                  border-b
                                  transition-all
                                  duration-300
                                "
                                style={{
                                  borderColor:
                                    topItemRevealed
                                      ? `${theme.border}1A`
                                      : theme.accent,

                                  borderWidth:
                                    topItemRevealed
                                      ? undefined
                                      : "2px",

                                  borderRadius:
                                    topItemRevealed
                                      ? undefined
                                      : "20px",

                                  backgroundColor:
                                    topItemRevealed
                                      ? "transparent"
                                      : `${theme.accent}0A`
                                }}
                              >

                                <div
                                  className="
                                    flex
                                    items-center
                                    gap-5
                                    py-5
                                    md:gap-8
                                    md:py-6
                                  "
                                >

                                  <div
                                    className="
                                      w-10
                                      shrink-0
                                      text-2xl
                                      font-black
                                      leading-none
                                      tracking-[-0.04em]
                                      md:w-16
                                      md:text-4xl
                                    "
                                    style={{
                                      color:
                                        theme.accent
                                    }}
                                  >
                                    01
                                  </div>


                                  <div
                                    className="
                                      min-w-0
                                      flex-1
                                      truncate
                                      text-xl
                                      font-black
                                      leading-tight
                                      tracking-[-0.025em]
                                      md:text-3xl
                                    "
                                  >
                                    {
                                      item.name
                                    }
                                  </div>

                                </div>


                                {
                                  !topItemRevealed && (

                                    <button
                                      type="button"
                                      onClick={
                                        handleRevealTopItem
                                      }
                                      className="
                                        absolute
                                        inset-0
                                        flex
                                        w-full
                                        max-w-full
                                        items-center
                                        justify-center
                                        rounded-[18px]
                                        px-4
                                        text-center
                                        transition
                                        hover:bg-black/[0.03]
                                        md:px-6
                                      "
                                      style={{
                                        backgroundColor:
                                          theme.bg
                                      }}
                                      aria-label="Reveal the number one ranked item"
                                    >

                                      <div
                                        className="
                                          w-full
                                          max-w-full
                                          min-w-0
                                          flex
                                          flex-col
                                          items-center
                                          justify-center
                                        "
                                      >

                                        <p
                                          className="
                                            whitespace-nowrap
                                            text-base
                                            font-black
                                            leading-tight
                                            tracking-[-0.03em]
                                            md:text-2xl
                                          "
                                          style={{
                                            color:
                                              theme.text
                                          }}
                                        >
                                          Would you have RANKD this #1?
                                        </p>


                                        <span
                                          className="
                                            mt-3
                                            max-w-full
                                            text-xs
                                            font-black
                                            uppercase
                                            tracking-[0.22em]
                                          "
                                          style={{
                                            color:
                                              theme.accent
                                          }}
                                        >
                                          Click to reveal →
                                        </span>

                                      </div>

                                    </button>

                                  )
                                }

                              </div>

                            )

                          }


                          return (

                            <div
                              key={
                                `${ranking.id}-${item.position}`
                              }
                              className="
                                flex
                                items-center
                                gap-5
                                border-b
                                py-5
                                md:gap-8
                                md:py-6
                              "
                              style={{
                                borderColor:
                                  `${theme.border}1A`
                              }}
                            >

                              <div
                                className="
                                  w-10
                                  shrink-0
                                  text-2xl
                                  font-black
                                  leading-none
                                  tracking-[-0.04em]
                                  md:w-16
                                  md:text-4xl
                                "
                                style={{
                                  color:
                                    theme.accent
                                }}
                              >
                                {
                                  String(
                                    item.position
                                  ).padStart(
                                    2,
                                    "0"
                                  )
                                }
                              </div>


                              <div
                                className="
                                  min-w-0
                                  flex-1
                                  text-xl
                                  font-black
                                  leading-tight
                                  tracking-[-0.025em]
                                  md:text-3xl
                                "
                              >
                                {
                                  item.name
                                }
                              </div>

                            </div>

                          )

                        }
                      )
                    }

                  </div>


                  <div
                    className="
                      mt-10
                      border-t
                      pt-8
                    "
                    style={{
                      borderColor:
                        `${theme.border}1A`
                    }}
                  >

                    <div
                      className="
                        mb-5
                        flex
                        flex-col
                        gap-4
                        md:flex-row
                        md:items-center
                        md:justify-between
                      "
                    >

                      <p
                        className="
                          text-xs
                          font-black
                          uppercase
                          tracking-[0.22em]
                        "
                        style={{
                          color:
                            theme.muted
                        }}
                      >
                        Make your call
                      </p>


                      <p
                        className="
                          text-xs
                          font-black
                          uppercase
                          tracking-[0.18em]
                        "
                        style={{
                          color:
                            theme.muted
                        }}
                      >
                        01 — 07
                      </p>

                    </div>


                    <RankingResponse
                      onRankd={
                        handleRankd
                      }

                      onRerankd={
                        handleRerankd
                      }

                      accentColor={
                        theme.accent
                      }

                      textColor={
                        theme.text
                      }

                      mutedColor={
                        theme.muted
                      }

                      borderColor={
                        theme.border
                      }

                      cardColor={
                        theme.bg
                      }
                    />

                  </div>


                  <div
                    className="
                      mt-8
                      border-t
                      pt-6
                    "
                    style={{
                      borderColor:
                        `${theme.border}1A`
                    }}
                  >

                    <Link
                      href={`/rank/${ranking.id}`}
                      className="
                        inline-flex
                        items-center
                        gap-3
                        text-sm
                        font-black
                        uppercase
                        tracking-[0.16em]
                        transition
                        hover:gap-4
                      "
                      style={{
                        color:
                          theme.text
                      }}
                    >
                      View original RANKD

                      <span
                        style={{
                          color:
                            theme.accent
                        }}
                      >
                        →
                      </span>

                    </Link>

                  </div>

                </div>

              </article>

            </>

          )
        }


        {
          state === "insight" && (

            <div
              className="
                relative
                min-h-[65vh]
                overflow-hidden
                rounded-[32px]
                border
                md:rounded-[40px]
              "
              style={{
                backgroundColor:
                  theme.bg,

                color:
                  theme.text,

                borderColor:
                  theme.border
              }}
            >

              <div
                className="
                  pointer-events-none
                  absolute
                  -right-8
                  -top-24
                  select-none
                  text-[18rem]
                  font-black
                  leading-none
                  tracking-[-0.16em]
                  opacity-[0.06]
                  md:-right-12
                  md:-top-32
                  md:text-[28rem]
                "
                style={{
                  color:
                    theme.accent
                }}
                aria-hidden="true"
              >
                7
              </div>


              <div
                className="
                  relative
                  z-10
                  p-7
                  md:p-12
                  lg:p-16
                "
              >

                <header
                  className="
                    border-b
                    pb-8
                  "
                  style={{
                    borderColor:
                      `${theme.border}1A`
                  }}
                >

                  <p
                    className="
                      text-xs
                      font-black
                      uppercase
                      tracking-[0.3em]
                    "
                    style={{
                      color:
                        theme.accent
                    }}
                  >
                    RANKD / {
                      theme.label
                    }
                  </p>


                  <h1
                    className="
                      mt-4
                      max-w-4xl
                      text-5xl
                      font-black
                      leading-[0.88]
                      tracking-[-0.06em]
                      md:text-7xl
                    "
                  >
                    You RANKD it.
                  </h1>


                  <p
                    className="
                      mt-5
                      max-w-2xl
                      text-lg
                      font-medium
                      leading-relaxed
                      md:text-xl
                    "
                    style={{
                      color:
                        theme.muted
                    }}
                  >
                    Your opinion is now part
                    of the conversation.
                  </p>

                </header>


                {
                  response === "rankd" && (

                    <section
                      className="
                        mt-10
                        rounded-[28px]
                        border
                        p-6
                        md:p-9
                      "
                      style={{
                        borderColor:
                          `${theme.border}33`,

                        backgroundColor:
                          `${theme.text}05`
                      }}
                    >

                      <div
                        className="
                          flex
                          flex-col
                          gap-6
                          md:flex-row
                          md:items-start
                          md:justify-between
                        "
                      >

                        <div
                          className="
                            max-w-3xl
                          "
                        >

                          <p
                            className="
                              text-xs
                              font-black
                              uppercase
                              tracking-[0.25em]
                            "
                            style={{
                              color:
                                theme.accent
                            }}
                          >
                            Community insight
                          </p>


                          <h2
                            className="
                              mt-4
                              text-3xl
                              font-black
                              leading-tight
                              tracking-[-0.04em]
                              md:text-5xl
                            "
                          >
                            {
                              insight.title
                            }
                          </h2>

                        </div>


                        <div
                          className="
                            shrink-0
                            rounded-full
                            border
                            px-5
                            py-3
                            text-sm
                            font-black
                          "
                          style={{
                            borderColor:
                              `${theme.border}33`,

                            color:
                              theme.accent
                          }}
                        >
                          {
                            insightScore
                          }%
                        </div>

                      </div>


                      <p
                        className="
                          mt-6
                          max-w-3xl
                          text-lg
                          font-bold
                          leading-relaxed
                          md:text-xl
                        "
                        style={{
                          color:
                            theme.text
                        }}
                      >
                        {
                          insight.description
                        }
                      </p>


                      <div
                        className="
                          mt-7
                          h-2
                          overflow-hidden
                          rounded-full
                        "
                        style={{
                          backgroundColor:
                            `${theme.border}14`
                        }}
                      >

                        <div
                          className="
                            h-full
                            rounded-full
                            transition-all
                            duration-500
                          "
                          style={{
                            width:
                              `${Math.min(
                                insightScore,
                                100
                              )}%`,

                            backgroundColor:
                              theme.accent
                          }}
                        />

                      </div>


                      <p
                        className="
                          mt-4
                          text-sm
                          leading-relaxed
                        "
                        style={{
                          color:
                            theme.muted
                        }}
                      >
                        Community insight combines
                        perspective and live activity
                        around this ranking.
                      </p>

                    </section>

                  )
                }


                {
                  nextRanking && (

                    <section
                      className="
                        mt-10
                        border-t
                        pt-10
                      "
                      style={{
                        borderColor:
                          `${theme.border}1A`
                      }}
                    >

                      <div
                        className="
                          flex
                          flex-col
                          gap-6
                          md:flex-row
                          md:items-end
                          md:justify-between
                        "
                      >

                        <div>

                          <p
                            className="
                              text-xs
                              font-black
                              uppercase
                              tracking-[0.25em]
                            "
                            style={{
                              color:
                                theme.accent
                            }}
                          >
                            Keep going
                          </p>


                          <h2
                            className="
                              mt-3
                              text-3xl
                              font-black
                              tracking-[-0.04em]
                              md:text-5xl
                            "
                          >
                            Your next RANKD.
                          </h2>


                          <p
                            className="
                              mt-3
                              text-base
                              font-medium
                              md:text-lg
                            "
                            style={{
                              color:
                                theme.muted
                            }}
                          >
                            {
                              nextRanking.category ===
                              ranking.category

                                ? `Another ${ranking.category} ranking.`

                                : "Another community opinion worth exploring."
                            }
                          </p>

                        </div>


                        <div
                          className="
                            shrink-0
                            text-xs
                            font-black
                            uppercase
                            tracking-[0.2em]
                          "
                          style={{
                            color:
                              theme.muted
                          }}
                        >
                          02 — 07
                        </div>

                      </div>


                      <div
                        className="
                          mt-7
                          rounded-[28px]
                          border
                          p-6
                          md:p-8
                        "
                        style={{
                          borderColor:
                            `${theme.border}33`,

                          backgroundColor:
                            `${theme.text}05`
                        }}
                      >

                        <p
                          className="
                            text-xs
                            font-black
                            uppercase
                            tracking-[0.22em]
                          "
                          style={{
                            color:
                              theme.accent
                          }}
                        >
                          {
                            nextRanking.category ||
                            "General"
                          }
                        </p>


                        <h3
                          className="
                            mt-3
                            max-w-4xl
                            text-3xl
                            font-black
                            leading-tight
                            tracking-[-0.04em]
                            md:text-5xl
                          "
                        >
                          {
                            formatRankingTitle(
                              nextRanking.title
                            )
                          }
                        </h3>


                        <button
                          type="button"
                          onClick={
                            viewNextRanking
                          }
                          className="
                            mt-7
                            rounded-full
                            border
                            px-6
                            py-4
                            text-sm
                            font-black
                            transition
                            hover:-translate-y-0.5
                          "
                          style={{
                            borderColor:
                              theme.accent,

                            backgroundColor:
                              theme.accent,

                            color:
                              theme.bg
                          }}
                        >
                          Rank this one too →
                        </button>

                      </div>

                    </section>

                  )
                }


                {
                  !nextRanking && (

                    <button
                      type="button"
                      onClick={() =>
                        router.push(
                          "/explore"
                        )
                      }
                      className="
                        mt-10
                        rounded-full
                        px-7
                        py-4
                        text-sm
                        font-black
                        transition
                        hover:-translate-y-0.5
                      "
                      style={{
                        backgroundColor:
                          theme.text,

                        color:
                          theme.bg
                      }}
                    >
                      Explore more RANKDs →
                    </button>

                  )
                }

              </div>

            </div>

          )
        }

      </div>

    </section>

  )
}