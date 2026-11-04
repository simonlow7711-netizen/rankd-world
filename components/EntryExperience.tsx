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
  useDwellSignal
} from "@/utils/dwellSignal"

import {
  formatRankingTitle
} from "@/utils/rankingTitle"

import RankingResponse from "@/components/RankingResponse"

import RevealTopCover from "@/components/RevealTopCover"

import EditionHeader, {
  EditionMark,
  EditionTitle
} from "@/components/EditionHeader"

import RankingDescription from "@/components/RankingDescription"

import {
  getCategoryTheme
} from "@/utils/categoryTheme"


type EntryExperienceProps = {
  rankings: Ranking[]
}


type ExperienceState =
  | "ranking"
  | "insight"


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


  useEffect(() => {

    setTopItemRevealed(
      false
    )

  }, [
    rankingIndex
  ])


  const ranking =
    eligibleRankings[
      rankingIndex
    ]

  useDwellSignal(
    "entry_dwell",
    {
      rankingId:
        ranking?.id
    }
  )


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

    if (
      ranking
    ) {
      void trackEvent(
        "ranking_reveal_top",
        {
          rankingId:
            ranking.id,
          surface:
            "entry"
        }
      )
    }

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
        bg-[#F7F4EE]
        px-5
        py-10
        text-black
        md:px-8
        md:py-16
      "
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
                    mx-auto
                    max-w-4xl
                    text-center
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
                      mx-auto
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
                  rankd-edition
                  relative
                  overflow-hidden
                  rounded-[32px]
                  border
                  md:rounded-[40px]
                "
                style={{
                  backgroundColor:
                    theme.paper,

                  color:
                    "#111111",

                  borderColor:
                    "#111111"
                }}
              >

                <div
                  className="
                    relative
                    z-10
                    p-7
                    md:p-12
                    lg:p-16
                  "
                >

                  <EditionHeader
                    theme={
                      theme
                    }
                    category={
                      ranking.category
                    }
                    bleed="hero"
                  >

                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      gap-7
                      text-center
                    "
                  >

                    <div
                      className="
                        mx-auto
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
                        <EditionMark
                          theme={
                            theme
                          }
                        >
                          {ranking.category}
                        </EditionMark>
                      </p>


                      <h2
                        className="
                          mt-3
                          text-4xl
                          font-black
                          leading-[0.86]
                          tracking-[-0.06em]
                          text-balance
                          hyphens-none
                          md:text-6xl
                          lg:text-7xl
                        "
                      >
                        <EditionTitle
                          theme={
                            theme
                          }
                        >
                          {
                            formatRankingTitle(
                              ranking.title
                            )
                          }
                        </EditionTitle>
                      </h2>

                    </div>


                    <div
                      className="
                        shrink-0
                        self-center
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
                          `color-mix(in srgb, ${theme.paper} 62%, transparent)`,

                        border:
                          `1px solid ${theme.accent}`,

                        color:
                          theme.accent
                      }}
                    >
                      TOP 7
                    </div>

                  </div>

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
                    className="
                      relative
                      z-10
                      mx-auto
                      mt-6
                      max-w-3xl
                      whitespace-pre-wrap
                      text-center
                      text-lg
                      font-medium
                      leading-relaxed
                      text-black/50
                      md:text-xl
                    "
                  />


                  <div
                    className="
                      mt-10
                    "
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
                                gap-3
                                border-b
                                py-5
                                text-center
                                md:py-6
                              "
                              style={{
                                borderColor:
                                  `${theme.border}1A`
                              }}
                            >

                              <div
                                className="
                                  text-2xl
                                  font-black
                                  leading-none
                                  tracking-[-0.04em]
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
                                  w-full
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
                                onReveal={
                                  handleRevealTopItem
                                }
                                accent={
                                  theme.accent
                                }
                                ink={
                                  theme.text
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
                        items-center
                        gap-2
                        text-center
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

                      card="bg-transparent"
                      cardColor="transparent"
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
                rankd-edition
                relative
                min-h-[65vh]
                overflow-hidden
                rounded-[28px]
                border
                text-black
                md:rounded-[32px]
              "
              style={{
                backgroundColor:
                  theme.paper,
                borderColor:
                  "#111111"
              }}
            >

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
                    text-center
                  "
                >

                  <EditionHeader
                    theme={
                      theme
                    }
                    category={
                      ranking.category
                    }
                    bleed="hero"
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
                    <EditionMark
                      theme={
                        theme
                      }
                    >
                      {ranking.category}
                    </EditionMark>
                  </p>


                  <h1
                    className="
                      mx-auto
                      mt-3
                      max-w-4xl
                      text-5xl
                      font-black
                      leading-[0.88]
                      tracking-[-0.06em]
                      md:text-7xl
                    "
                  >
                    <EditionTitle
                      theme={
                        theme
                      }
                    >
                      You RANKD it.
                    </EditionTitle>
                  </h1>

                  </EditionHeader>


                  <p
                    className="
                      relative
                      z-10
                      mx-auto
                      mt-6
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
                          items-center
                          gap-6
                          text-center
                        "
                      >

                        <div
                          className="
                            mx-auto
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
                          items-center
                          gap-4
                          text-center
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
                              "#FFFFFF"
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
                          "#FFFFFF"
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