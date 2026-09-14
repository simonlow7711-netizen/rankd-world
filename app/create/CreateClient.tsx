"use client"

import {
  useEffect,
  useRef,
  useState
} from "react"

import {
  useRouter,
  useSearchParams
} from "next/navigation"

import {
  Ranking,
  RankingBuilderItem
} from "@/types/ranking"

import {
  createSupabaseRanking,
  getSupabaseRanking
} from "@/utils/supabaseRankings"

import {
  stripRankingPrefix
} from "@/utils/rankingTitle"

import {
  supabase
} from "@/utils/supabase"

import SortableRankingList from "@/components/SortableRankingList"

import {
  getTasteGraph,
  saveTasteGraph
} from "@/utils/tasteGraphRepository"

import {
  compareTasteFeedback
} from "@/utils/tasteFeedbackComparison"

import {
  buildTasteFeedbackSignals
} from "@/utils/tasteFeedbackSignals"

import {
  buildTasteBaselineSignals
} from "@/utils/tasteBaselineSignals"

import {
  TasteGraph
} from "@/utils/tasteGraph"

import {
  categories,
  isValidRankingCategory
} from "@/utils/categories"

import {
  createRemixNotification
} from "@/utils/notifications"


type CategoryTheme = {
  bg: string
  text: string
  accent: string
  muted: string
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
    label: "MENU / 07"
  },

  "Film & TV": {
    bg: "#ECEAE5",
    text: "#151515",
    accent: "#FF6B35",
    muted: "#686560",
    label: "FRAME / 07"
  },

  "Music": {
    bg: "#E9E3DE",
    text: "#211A1A",
    accent: "#C43D35",
    muted: "#746562",
    label: "SIDE A / 07"
  },

  "Sport": {
    bg: "#E7EBE5",
    text: "#101510",
    accent: "#E54B2F",
    muted: "#586058",
    label: "MATCH / 07"
  },

  "Gaming": {
    bg: "#E7ECE9",
    text: "#0E1416",
    accent: "#39A932",
    muted: "#59645F",
    label: "PLAYER 1 / 07"
  },

  "Travel": {
    bg: "#E0ECE8",
    text: "#123B36",
    accent: "#087D71",
    muted: "#58736F",
    label: "FIELD NOTES / 07"
  },

  "Technology": {
    bg: "#E9EBE9",
    text: "#111820",
    accent: "#315AE8",
    muted: "#69737C",
    label: "SYSTEM / 07"
  },

  "Lifestyle": {
    bg: "#EEE8DE",
    text: "#29241E",
    accent: "#A45D3E",
    muted: "#766E64",
    label: "EDIT / 07"
  },

  "Books": {
    bg: "#F1EBDD",
    text: "#30251D",
    accent: "#9B493D",
    muted: "#75695E",
    label: "PUBLISHING / 07"
  },

  "Art & Design": {
    bg: "#E9E6DF",
    text: "#151515",
    accent: "#B58B18",
    muted: "#68645C",
    label: "CATALOGUE / 07"
  },

  "Fashion": {
    bg: "#ECE3E9",
    text: "#231B22",
    accent: "#A52F68",
    muted: "#786773",
    label: "COLLECTION / 07"
  },

  "Beauty": {
    bg: "#F1E5E3",
    text: "#2C1C1F",
    accent: "#C34E68",
    muted: "#856B70",
    label: "EDIT / 07"
  },

  "Health & Fitness": {
    bg: "#E4EEE6",
    text: "#17251B",
    accent: "#16824D",
    muted: "#607467",
    label: "ENERGY / 07"
  },

  "Business": {
    bg: "#E5E9EE",
    text: "#14202B",
    accent: "#245A91",
    muted: "#64717D",
    label: "BRIEFING / 07"
  },

  "Science": {
    bg: "#E0EAEC",
    text: "#14272C",
    accent: "#157D8C",
    muted: "#61767C",
    label: "FIELD NOTES / 07"
  },

  "History": {
    bg: "#E9E0CF",
    text: "#2D2419",
    accent: "#86502E",
    muted: "#766A5B",
    label: "ARCHIVE / 07"
  },

  "Nature & Animals": {
    bg: "#E0E9DC",
    text: "#172418",
    accent: "#4C7D3F",
    muted: "#62715E",
    label: "FIELD GUIDE / 07"
  },

  "Cars & Transport": {
    bg: "#E2E5E7",
    text: "#141B20",
    accent: "#C63D2E",
    muted: "#68737B",
    label: "ROAD / 07"
  },

  "Home & Garden": {
    bg: "#E9E7DD",
    text: "#25251E",
    accent: "#6E7C45",
    muted: "#707064",
    label: "LIVING / 07"
  },

  "General": {
    bg: "#F7F4EE",
    text: "#000000",
    accent: "#FF6B35",
    muted: "#000000",
    label: "TOP 7"
  }
}


function createEmptyItems(): RankingBuilderItem[] {

  return Array.from(

    {
      length: 7
    },

    () => ({

      id:
        crypto.randomUUID(),

      name:
        ""

    })

  )

}


function createItemsFromValues(
  values: string[]
): RankingBuilderItem[] {

  return Array.from(

    {
      length: 7
    },

    (_, index) => ({

      id:
        crypto.randomUUID(),

      name:
        values[index] ?? ""

    })

  )

}


export default function CreateClient() {

  const router =
    useRouter()


  const searchParams =
    useSearchParams()


  const [
    title,
    setTitle
  ] = useState("")


  const [
    category,
    setCategory
  ] = useState(
    "General"
  )


  const [
    items,
    setItems
  ] = useState<RankingBuilderItem[]>(

    createEmptyItems()

  )


  const [
    description,
    setDescription
  ] = useState("")


  const [
    saving,
    setSaving
  ] = useState(false)


  const [
    loadingRecommendation,
    setLoadingRecommendation
  ] = useState(false)


  const [
    error,
    setError
  ] = useState("")


  const hydratedRef =
    useRef(false)


  const recommendationId =
    searchParams.get(
      "recommendationId"
    )


  const recommendationScoreParam =
    searchParams.get(
      "recommendationScore"
    )


  const recommendationScore =
    recommendationScoreParam
      ? Number(
          recommendationScoreParam
        )
      : 0


  useEffect(() => {

    if (
      hydratedRef.current
    ) {

      return

    }


    async function hydrateCreateForm() {

      hydratedRef.current =
        true


      setError("")


      const initialTitle =
        searchParams.get(
          "title"
        )


      const initialCategory =
        searchParams.get(
          "category"
        )


      const initialDescription =
        searchParams.get(
          "description"
        )


      const initialItems =
        searchParams.get(
          "items"
        )


      /*
       *
       * Taste recommendation flow.
       *
       */

      if (
        recommendationId
        &&
        !initialItems
      ) {

        try {

          setLoadingRecommendation(
            true
          )


          const recommendation =
            await getSupabaseRanking(
              recommendationId
            )


          if (
            !recommendation
          ) {

            setError(
              "Unable to load the recommended RANKD."
            )

            return

          }


          setTitle(

            stripRankingPrefix(

              recommendation.title

            )

          )


          const recommendationCategory =
            recommendation.category ||
            "General"


          setCategory(

            isValidRankingCategory(
              recommendationCategory
            )

              ? recommendationCategory
              : "General"

          )


          setDescription(

            recommendation.description ??
            ""

          )


          const recommendationItems =
            recommendation.items

              .sort(

                (
                  a,
                  b
                ) =>
                  a.position -
                  b.position

              )

              .map(

                item =>
                  item.name

              )

              .filter(Boolean)


          setItems(

            createItemsFromValues(

              recommendationItems

            )

          )


          return

        }

        catch (
          recommendationError
        ) {

          console.error(

            "LOAD TASTE RECOMMENDATION ERROR",

            recommendationError

          )


          setError(
            "Unable to load the recommended RANKD."
          )

        }

        finally {

          setLoadingRecommendation(
            false
          )

        }

      }


      /*
       *
       * Standard creation / RANKD / RE-RANKD
       * hydration.
       *
       */

      if (
        initialTitle
      ) {

        setTitle(

          stripRankingPrefix(

            initialTitle

          )

        )

      }


      if (
        initialCategory
      ) {

        if (
          isValidRankingCategory(
            initialCategory
          )
        ) {

          setCategory(
            initialCategory
          )

        }

      }


      if (
        initialDescription
      ) {

        setDescription(
          initialDescription
        )

      }


      if (
        initialItems
      ) {

        const itemValues =
          initialItems

            .split("|")

            .map(
              item =>
                item.trim()
            )

            .filter(Boolean)


        if (
          itemValues.length > 0
        ) {

          setItems(

            createItemsFromValues(

              itemValues

            )

          )

        }

      }

    }


    hydrateCreateForm()


  }, [

    searchParams,
    recommendationId

  ])


  function addItem() {

    if (
      items.length >= 7
    ) {

      return

    }


    setItems(

      current => [

        ...current,

        {

          id:
            crypto.randomUUID(),

          name:
            ""

        }

      ]

    )

  }


  async function handleSubmit(
    event: React.FormEvent
  ) {

    event.preventDefault()


    if (
      saving
      ||
      loadingRecommendation
    ) {

      return

    }


    setError("")


    const cleanTitle =
      title.trim()


    const cleanItems =
      items

        .map(
          item =>
            item.name.trim()
        )

        .filter(Boolean)


    if (
      !cleanTitle
    ) {

      setError(
        "Please add a title."
      )

      return

    }


    if (
      cleanItems.length !== 7
    ) {

      setError(
        "Please add exactly 7 items."
      )

      return

    }


    const finalCategory =
      isValidRankingCategory(
        category
      )

        ? category
        : "General"


    setSaving(true)


    const finalParentId =
      searchParams.get(
        "parentId"
      )


    const finalRootId =
      searchParams.get(
        "rootId"
      )


    const ranking: Ranking = {

      id:
        crypto.randomUUID(),

      title:
        cleanTitle,

      category:
        finalCategory,

      creator:
        "Anonymous",

      creatorId:
        "",

      creatorUsername:
        undefined,

      creatorDisplayName:
        undefined,

      description:
        description.trim(),

      items:

        cleanItems.map(

          (
            name,
            index
          ) => ({

            position:
              index + 1,

            name,

            votes:
              0

          })

        ),

      createdAt:
        new Date().toISOString(),

      views:
        0,

      source:
        "community",

      parentId:
        finalParentId,

      rootId:
        finalRootId

    }


    try {

      let {
        data: {
          user
        }
      } =
        await supabase.auth.getUser()


      /*
       *
       * Start an anonymous session if
       * necessary.
       *
       */

      if (
        !user
      ) {

        const {
          data,
          error: anonymousAuthError
        } =
          await supabase.auth.signInAnonymously()


        if (
          anonymousAuthError
          ||
          !data.user
        ) {

          console.error(

            "ANONYMOUS AUTH ERROR",

            anonymousAuthError

          )


          setError(

            "Unable to start your RANKD session. Please try again."

          )

          setSaving(false)

          return

        }


        user =
          data.user

      }


      /*
       *
       * Create the ranking.
       *
       * This is the only operation that blocks
       * navigation to the new RANKD.
       *
       */

      await createSupabaseRanking(

        ranking,

        user.id

      )


      /*
       *
       * Open the newly created RANKD immediately.
       *
       * Everything below runs after publication
       * and does not delay the user.
       *
       */

      router.push(

        `/rank/${ranking.id}`

      )


      /*
       *
       * Secondary background work.
       *
       * These operations enrich the ranking but
       * should never hold up publication.
       *
       */

      void (async () => {

        /*
         *
         * Notify the creator of the ranking
         * being remixed.
         *
         */

        if (
          finalParentId
        ) {

          try {

            const parentRanking =
              await getSupabaseRanking(

                finalParentId

              )


            const parentCreatorId =
              parentRanking?.creatorId


            if (
              parentCreatorId
              &&
              parentCreatorId !==
              user.id
            ) {

              await createRemixNotification({

                recipientUserId:
                  parentCreatorId,

                actorUserId:
                  user.id,

                originalRankingId:
                  finalParentId,

                remixRankingId:
                  ranking.id

              })

            }

          }

          catch (
            notificationError
          ) {

            console.error(

              "REMIX NOTIFICATION ERROR",

              notificationError

            )

          }

        }


        /*
         *
         * Build baseline Taste Graph signals.
         *
         */

        try {

          const existingGraph =
            await getTasteGraph(

              user.id

            )


          const baselineSignals =
            buildTasteBaselineSignals(

              user.id,

              ranking

            )


          if (
            baselineSignals.length > 0
          ) {

            const baselineGraph: TasteGraph = {

              ...existingGraph,

              signals: [

                ...existingGraph.signals,

                ...baselineSignals

              ]

            }


            await saveTasteGraph(

              baselineGraph

            )

          }

        }

        catch (
          tasteGraphError
        ) {

          console.error(

            "TASTE GRAPH BASELINE ERROR",

            tasteGraphError

          )

        }


        /*
         *
         * Recommendation feedback.
         *
         */

        if (
          recommendationId
        ) {

          try {

            const recommendation =
              await getSupabaseRanking(

                recommendationId

              )


            if (
              recommendation
            ) {

              const existingGraph =
                await getTasteGraph(

                  user.id

                )


              const comparison =
                compareTasteFeedback(

                  recommendation,

                  ranking,

                  recommendationScore

                )


              const feedbackSignals =
                buildTasteFeedbackSignals(

                  user.id,

                  recommendation,

                  ranking,

                  comparison

                )


              if (
                feedbackSignals.length > 0
              ) {

                const feedbackGraph: TasteGraph = {

                  ...existingGraph,

                  signals: [

                    ...existingGraph.signals,

                    ...feedbackSignals

                  ]

                }


                await saveTasteGraph(

                  feedbackGraph

                )

              }

            }

          }

          catch (
            feedbackError
          ) {

            console.error(

              "TASTE FEEDBACK ERROR",

              feedbackError

            )

          }

        }

      })()

    }

    catch (
      submitError
    ) {

      console.error(

        "CREATE RANKING ERROR",

        submitError

      )


      setError(

        "Unable to create your RANKD. Please try again."

      )

      setSaving(false)

    }

  }


  const theme =
    categoryThemes[
      category
    ] ??
    categoryThemes.General


  if (
    loadingRecommendation
  ) {

    return (

      <main
        className="
          min-h-screen
          bg-[#F7F4EE]
        "
      >

        <div
          className="
            mx-auto
            max-w-5xl
            px-5
            py-10
            md:px-8
            md:py-16
          "
        >

          <div
            className="
              rounded-[32px]
              p-7
              md:p-10
            "
            style={{
              backgroundColor:
                theme.bg,

              color:
                theme.text
            }}
          >

            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.18em]
              "
              style={{
                color:
                  theme.accent
              }}
            >

              Taste recommendation

            </p>


            <h1
              className="
                mt-3
                text-4xl
                font-black
                leading-[0.95]
                tracking-[-0.05em]
                md:text-5xl
              "
            >

              Loading your
              recommendation...

            </h1>


            <p
              className="
                mt-4
                max-w-xl
                text-base
                font-medium
                opacity-70
              "
            >

              Preparing the Top 7 for you to rank.

            </p>

          </div>

        </div>

      </main>

    )

  }


  return (

    <main
      className="
        min-h-screen
        bg-[#F7F4EE]
        text-black
      "
    >

      <div
        className="
          mx-auto
          max-w-5xl
          px-5
          py-8
          md:px-8
          md:py-12
        "
      >

        <header
          className="
            mb-8
            md:mb-10
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >

            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.18em]
                text-[#FF6B35]
              "
            >

              Create

            </p>


            <span
              className="
                text-[11px]
                font-black
                uppercase
                tracking-[0.16em]
                opacity-50
              "
            >

              {theme.label}

            </span>

          </div>


          <h1
            className="
              mt-3
              max-w-3xl
              text-5xl
              font-black
              leading-[0.92]
              tracking-[-0.06em]
              md:text-7xl
            "
          >

            Make your Top 7.

          </h1>


          <p
            className="
              mt-4
              max-w-xl
              text-base
              font-medium
              leading-relaxed
              opacity-65
              md:text-lg
            "
          >

            Make your choices.
            We'll remember what you like.

          </p>


          {
            recommendationId && (

              <div
                className="
                  mt-6
                  max-w-xl
                  rounded-[24px]
                  px-5
                  py-4
                "
                style={{
                  backgroundColor:
                    theme.bg
                }}
              >

                <p
                  className="
                    text-[11px]
                    font-black
                    uppercase
                    tracking-[0.16em]
                  "
                  style={{
                    color:
                      theme.accent
                  }}
                >

                  Taste recommendation

                </p>


                <p
                  className="
                    mt-1
                    text-sm
                    font-bold
                  "
                >

                  Adjust the ranking to make it yours.

                </p>

              </div>

            )
          }

        </header>


        <form
          onSubmit={
            handleSubmit
          }
          className="
            space-y-7
            md:space-y-8
          "
        >

          <section
            className="
              rounded-[32px]
              bg-white/60
              p-6
              md:p-8
            "
          >

            <div
              className="
                flex
                flex-col
                gap-5
                md:flex-row
                md:items-end
                md:justify-between
              "
            >

              <div
                className="
                  min-w-0
                  flex-1
                "
              >

                <label
                  htmlFor="rankd-title"
                  className="
                    block
                    text-[11px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    opacity-60
                  "
                >

                  Title

                </label>


                <input
                  id="rankd-title"
                  value={
                    title
                  }
                  onChange={
                    event =>
                      setTitle(
                        event.target.value
                      )
                  }
                  placeholder="Top 7..."
                  className="
                    mt-2
                    w-full
                    border-0
                    border-b-2
                    bg-transparent
                    px-0
                    py-3
                    text-3xl
                    font-black
                    leading-tight
                    tracking-[-0.04em]
                    outline-none
                    placeholder:opacity-30
                    md:text-4xl
                  "
                  style={{
                    borderColor:
                      `${theme.text}20`,
                    color:
                      theme.text
                  }}
                />

              </div>


              <div
                className="
                  shrink-0
                  md:w-56
                "
              >

                <label
                  htmlFor="rankd-category"
                  className="
                    block
                    text-[11px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    opacity-60
                  "
                >

                  Category

                </label>


                <select
                  id="rankd-category"
                  value={
                    category
                  }
                  onChange={
                    event =>
                      setCategory(
                        event.target.value
                      )
                  }
                  className="
                    mt-2
                    w-full
                    rounded-full
                    border
                    bg-transparent
                    px-4
                    py-3
                    text-sm
                    font-black
                    outline-none
                  "
                  style={{
                    borderColor:
                      `${theme.text}30`,
                    color:
                      theme.text
                  }}
                >

                  {
                    categories.map(

                      option => (

                        <option
                          key={
                            option
                          }
                          value={
                            option
                          }
                        >

                          {option}

                        </option>

                      )

                    )
                  }

                </select>

              </div>

            </div>

          </section>


          <section
            className="
              rounded-[32px]
              p-6
              md:p-8
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
                flex
                items-end
                justify-between
                gap-4
              "
            >

              <div>

                <p
                  className="
                    text-[11px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                  "
                  style={{
                    color:
                      theme.accent
                  }}
                >

                  Your ranking

                </p>


                <h2
                  className="
                    mt-2
                    text-3xl
                    font-black
                    leading-none
                    tracking-[-0.04em]
                    md:text-4xl
                  "
                >

                  Top 7

                </h2>

              </div>


              <span
                className="
                  text-sm
                  font-black
                  opacity-40
                "
              >

                {items.length} / 7

              </span>

            </div>


            <div
              className="
                mt-6
              "
            >

              <SortableRankingList

                items={
                  items
                }

                setItems={
                  setItems
                }

              />

            </div>


            {
              items.length < 7 && (

                <button
                  type="button"
                  onClick={
                    addItem
                  }
                  className="
                    mt-6
                    rounded-full
                    border
                    px-5
                    py-3
                    text-sm
                    font-black
                    transition
                    hover:bg-black
                    hover:text-white
                  "
                  style={{
                    borderColor:
                      `${theme.text}35`
                  }}
                >

                  Add item

                </button>

              )
            }

          </section>


          <section
            className="
              rounded-[28px]
              bg-white/40
              p-6
              md:p-7
            "
          >

            <label
              htmlFor="rankd-description"
              className="
                block
                text-[11px]
                font-black
                uppercase
                tracking-[0.18em]
                opacity-50
              "
            >

              Description
              <span
                className="
                  ml-2
                  font-medium
                  normal-case
                  tracking-normal
                  opacity-70
                "
              >

                optional

              </span>

            </label>


            <textarea
              id="rankd-description"
              value={
                description
              }
              onChange={
                event =>
                  setDescription(
                    event.target.value
                  )
              }
              rows={3}
              placeholder="Why this Top 7?"
              className="
                mt-3
                w-full
                resize-none
                rounded-2xl
                border
                bg-white/60
                px-4
                py-4
                text-base
                font-medium
                outline-none
              "
              style={{
                borderColor:
                  `${theme.text}18`
              }}
            />

          </section>


          {
            error && (

              <div
                className="
                  rounded-2xl
                  border
                  border-red-300
                  bg-red-50
                  px-5
                  py-4
                  text-sm
                  font-bold
                  text-red-700
                "
              >

                {error}

              </div>

            )
          }


          <div
            className="
              flex
              flex-col
              gap-4
              pt-1
              md:flex-row
              md:items-center
              md:justify-end
            "
          >

            <p
              className="
                text-xs
                font-bold
                opacity-45
                md:mr-auto
              "
            >

              Seven choices.
              One RANKD.

            </p>


            <button
              type="submit"
              disabled={
                saving
                ||
                loadingRecommendation
              }
              className="
                inline-flex
                w-full
                items-center
                justify-center
                rounded-full
                border
                border-black
                bg-black
                px-8
                py-4
                text-sm
                font-black
                text-white
                transition
                hover:bg-[#FF6B35]
                hover:text-black
                disabled:cursor-not-allowed
                disabled:opacity-50
                md:w-auto
              "
            >

              {
                saving

                  ? "Creating..."

                  : "Create RANKD →"
              }

            </button>

          </div>

        </form>

      </div>

    </main>

  )

}