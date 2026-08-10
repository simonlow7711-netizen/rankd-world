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


const categories = [

  "Food & Drink",
  "Film & TV",
  "Music",
  "Sport",
  "Gaming",
  "Travel",
  "Technology",
  "Lifestyle",
  "General"

]


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
  ] = useState("General")


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

            categories.includes(
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
        &&
        categories.includes(
          initialCategory
        )
      ) {

        setCategory(
          initialCategory
        )

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
        category || "General",

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


      if (
        !user
      ) {

        const {
          data,
          error:anonymousAuthError
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

          return

        }


        user =
          data.user

      }


      await createSupabaseRanking(

        ranking,

        user.id

      )


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


      router.push(

        `/rank/${ranking.id}`

      )


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

    }

    finally {

      setSaving(false)

    }

  }


  if (
    loadingRecommendation
  ) {

    return (

      <main
        className="
          min-h-screen
        "
      >

        <div
          className="
            mx-auto
            max-w-6xl
            px-6
            py-16
          "
        >

          <div
            className="
              rankd-card
              p-8
            "
          >

            <p
              className="
                rankd-accent
                uppercase
                tracking-widest
                text-sm
                font-black
              "
            >

              Taste recommendation

            </p>


            <h1
              className="
                text-4xl
                font-black
                mt-3
              "
            >

              Loading your recommendation...

            </h1>


            <p
              className="
                mt-4
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
      "
    >

      <div
        className="
          mx-auto
          max-w-6xl
          px-6
          py-16
        "
      >

        <div
          className="
            mb-12
          "
        >

          <p
            className="
              rankd-accent
              uppercase
              tracking-widest
              text-sm
              font-black
            "
          >

            Create

          </p>


          <h1
            className="
              text-5xl
              md:text-6xl
              font-black
              mt-3
            "
          >

            Make your Top 7.

          </h1>


          <p
            className="
              mt-4
              text-lg
              opacity-70
              max-w-2xl
            "
          >

            Your choices help build your personal taste graph.

          </p>


          {recommendationId && (

            <div
              className="
                mt-6
                rounded-2xl
                border
                p-5
                rankd-card
              "
            >

              <p
                className="
                  text-sm
                  font-black
                  uppercase
                  tracking-widest
                  rankd-accent
                "
              >

                Taste recommendation

              </p>


              <p
                className="
                  mt-2
                  font-bold
                "
              >

                Adjust the ranking to challenge
                the recommendation and improve
                your Taste Graph.

              </p>

            </div>

          )}

        </div>


        <form
          onSubmit={
            handleSubmit
          }
          className="
            space-y-10
          "
        >

          <div
            className="
              rankd-card
              p-8
            "
          >

            <label
              className="
                block
                text-sm
                font-black
                uppercase
                tracking-widest
              "
            >

              Title

            </label>


            <input
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
                mt-3
                w-full
                rounded-xl
                border
                px-4
                py-4
                text-lg
                font-bold
              "
            />

          </div>


          <div
            className="
              rankd-card
              p-8
            "
          >

            <label
              className="
                block
                text-sm
                font-black
                uppercase
                tracking-widest
              "
            >

              Category

            </label>


            <select
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
                mt-3
                w-full
                rounded-xl
                border
                px-4
                py-4
                font-bold
              "
            >

              {categories.map(

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

              )}

            </select>

          </div>


          <div
            className="
              rankd-card
              p-8
            "
          >

            <label
              className="
                block
                text-sm
                font-black
                uppercase
                tracking-widest
              "
            >

              Your Top 7

            </label>


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


            {items.length < 7 && (

              <button
                type="button"
                onClick={
                  addItem
                }
                className="
                  mt-6
                  rounded-xl
                  border
                  px-5
                  py-3
                  font-black
                "
              >

                Add item

              </button>

            )}

          </div>


          <div
            className="
              rankd-card
              p-8
            "
          >

            <label
              className="
                block
                text-sm
                font-black
                uppercase
                tracking-widest
              "
            >

              Description

            </label>


            <textarea
              value={
                description
              }
              onChange={
                event =>
                  setDescription(
                    event.target.value
                  )
              }
              rows={4}
              placeholder="Why this Top 7?"
              className="
                mt-3
                w-full
                rounded-xl
                border
                px-4
                py-4
              "
            />

          </div>


          {error && (

            <div
              className="
                rounded-xl
                border
                border-red-300
                bg-red-50
                px-5
                py-4
                text-red-700
                font-bold
              "
            >

              {error}

            </div>

          )}


          <button
            type="submit"
            disabled={
              saving
              ||
              loadingRecommendation
            }
            className="
              w-full
              rounded-2xl
              px-6
              py-5
              font-black
              text-lg
              rankd-primary
              disabled:opacity-50
            "
          >

            {saving

              ? "Creating..."

              : recommendationId

                ? "Create RANKD & Improve My Taste Graph"

                : "Create RANKD"

            }

          </button>

        </form>

      </div>

    </main>

  )

}