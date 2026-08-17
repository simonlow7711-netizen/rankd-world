"use client"


import {
  useEffect,
  useMemo,
  useState
} from "react"


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
              rankd-accent
              uppercase
              tracking-[0.3em]
              text-sm
              font-black
            "
          >

            RANKD

          </p>


          <h1
            className="
              mt-5
              text-5xl
              md:text-7xl
              font-black
              leading-none
            "
          >

            Nothing to rank yet.

          </h1>


          <p
            className="
              mt-6
              text-lg
              rankd-muted
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
              rankd-button
            "

          >

            Create a RANKD →

          </button>

        </div>

      </section>

    )

  }


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
        )
        /
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
        text-black
        px-5
        py-12
        md:px-6
        md:py-20
      "
    >

      <div
        className="
          max-w-5xl
          mx-auto
        "
      >

        {
          state === "ranking" && (

            <>

              <header
                className="
                  mb-10
                  text-center
                "
              >

                <p
                  className="
                    rankd-accent
                    uppercase
                    tracking-[0.3em]
                    text-sm
                    font-black
                  "
                >

                  Your first RANKD

                </p>


                <h1
                  className="
                    mt-5
                    text-4xl
                    md:text-6xl
                    font-black
                    leading-none
                  "
                >

                  Would you rank this
                  the same?

                </h1>


                <p
                  className="
                    mt-5
                    text-lg
                    md:text-xl
                    rankd-muted
                    max-w-xl
                    mx-auto
                  "
                >

                  Take a look at the Top 7,
                  then make your call.

                </p>

              </header>


              <article
                className="
                  rounded-[40px]
                  bg-white
                  border
                  border-black/10
                  overflow-hidden
                  shadow-sm
                "
              >

                <div
                  className="
                    p-6
                    md:p-12
                  "
                >

                  <div
                    className="
                      flex
                      flex-col
                      md:flex-row
                      md:items-start
                      md:justify-between
                      gap-5
                    "
                  >

                    <div>

                      <p
                        className="
                          rankd-accent
                          uppercase
                          tracking-widest
                          text-sm
                          font-black
                        "
                      >

                        {
                          ranking.category ||
                          "General"
                        }

                      </p>


                      <h2
                        className="
                          mt-4
                          text-4xl
                          md:text-6xl
                          font-black
                          leading-[0.95]
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
                        bg-[#F7F4EE]
                        px-4
                        py-2
                        text-sm
                        font-black
                      "
                    >

                      TOP 7

                    </div>

                  </div>


                  {
                    ranking.description && (

                      <p
                        className="
                          mt-6
                          text-lg
                          rankd-muted
                          max-w-2xl
                        "
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
                      border-t
                      border-black/10
                    "
                  >

                    {
                      sortedItems.map(

                        item => (

                          <div
                            key={
                              `${ranking.id}-${item.position}`
                            }

                            className="
                              flex
                              items-center
                              gap-5
                              md:gap-7
                              py-5
                              md:py-6
                              border-b
                              border-black/10
                            "
                          >

                            <div
                              className="
                                w-10
                                md:w-14
                                shrink-0
                                text-2xl
                                md:text-4xl
                                font-black
                                rankd-accent
                              "
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
                                flex-1
                                text-xl
                                md:text-3xl
                                font-black
                                leading-tight
                              "
                            >

                              {
                                item.name
                              }

                            </div>

                          </div>

                        )

                      )
                    }

                  </div>


                  <RankingResponse

                    onRankd={
                      handleRankd
                    }

                    onRerankd={
                      handleRerankd
                    }

                  />

                </div>

              </article>

            </>

          )
        }


        {
          state === "insight" && (

            <div
              className="
                min-h-[65vh]
                flex
                items-center
                justify-center
              "
            >

              <div
                className="
                  w-full
                  max-w-2xl
                  text-center
                "
              >

                <p
                  className="
                    rankd-accent
                    uppercase
                    tracking-[0.3em]
                    text-sm
                    font-black
                  "
                >

                  Community insight

                </p>


                {
                  response === "rankd" && (

                    <>

                      <h1
                        className="
                          mt-5
                          text-5xl
                          md:text-7xl
                          font-black
                          leading-none
                        "
                      >

                        You RANKD it.

                      </h1>


                      <div
                        className="
                          mt-8
                          rounded-[32px]
                          bg-white
                          border
                          border-black/10
                          p-7
                          md:p-9
                          text-left
                        "
                      >

                        <div
                          className="
                            flex
                            items-start
                            justify-between
                            gap-6
                          "
                        >

                          <div>

                            <p
                              className="
                                text-xs
                                uppercase
                                tracking-[0.25em]
                                font-black
                                rankd-muted
                              "
                            >

                              The community

                            </p>


                            <h2
                              className="
                                mt-3
                                text-3xl
                                md:text-4xl
                                font-black
                                leading-tight
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
                              bg-[#F7F4EE]
                              px-4
                              py-2
                              text-sm
                              font-black
                            "
                          >

                            {insightScore}%

                          </div>

                        </div>


                        <p
                          className="
                            mt-5
                            text-lg
                            md:text-xl
                            font-bold
                          "
                        >

                          {
                            insight.description
                          }

                        </p>


                        <div
                          className="
                            mt-6
                            h-2
                            rounded-full
                            bg-[#F7F4EE]
                            overflow-hidden
                          "
                        >

                          <div
                            className="
                              h-full
                              bg-black
                              rounded-full
                              transition-all
                              duration-500
                            "
                            style={{
                              width:
                                `${Math.min(
                                  insightScore,
                                  100
                                )}%`
                            }}
                          />

                        </div>


                        <p
                          className="
                            mt-3
                            text-sm
                            rankd-muted
                          "
                        >

                          Community insight combines
                          perspective and live activity
                          around this ranking.

                        </p>

                      </div>


                      <p
                        className="
                          mt-7
                          rankd-muted
                        "
                      >

                        Your opinion is now part
                        of the conversation.

                      </p>

                    </>

                  )
                }


                {
                  nextRanking && (

                    <div
                      className="
                        mt-10
                        rounded-[32px]
                        bg-black
                        text-white
                        p-7
                        md:p-8
                        text-left
                      "
                    >

                      <p
                        className="
                          text-xs
                          uppercase
                          tracking-[0.25em]
                          font-black
                          opacity-60
                        "
                      >

                        Keep going

                      </p>


                      <h2
                        className="
                          mt-3
                          text-3xl
                          md:text-4xl
                          font-black
                        "
                      >

                        Your next RANKD

                      </h2>


                      <p
                        className="
                          mt-3
                          text-white/60
                        "
                      >

                        {
                          nextRanking.category ===
                          ranking.category

                            ? `Another ${ranking.category} ranking.`

                            : "Another community opinion worth exploring."
                        }

                      </p>


                      <div
                        className="
                          mt-6
                          rounded-[24px]
                          bg-white
                          text-black
                          p-5
                        "
                      >

                        <p
                          className="
                            text-xs
                            uppercase
                            tracking-widest
                            font-black
                            rankd-accent
                          "
                        >

                          {
                            nextRanking.category ||
                            "General"
                          }

                        </p>


                        <h3
                          className="
                            mt-2
                            text-2xl
                            md:text-3xl
                            font-black
                          "
                        >

                          {
                            formatRankingTitle(
                              nextRanking.title
                            )
                          }

                        </h3>

                      </div>


                      <button

                        type="button"

                        onClick={
                          viewNextRanking
                        }

                        className="
                          mt-5
                          w-full
                          rounded-[24px]
                          bg-white
                          text-black
                          px-6
                          py-5
                          font-black
                          text-lg
                          hover:-translate-y-1
                          transition
                        "

                      >

                        Rank this one too →

                      </button>

                    </div>

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
                        rankd-button
                      "

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