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


export default function CreateClient() {

  const router =
    useRouter()

  const searchParams =
    useSearchParams()


  const [title, setTitle] =
    useState("")

  const [category, setCategory] =
    useState("General")

  const [items, setItems] =
    useState<RankingBuilderItem[]>(

      createEmptyItems()

    )

  const [description, setDescription] =
    useState("")

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState("")


  const hydratedRef =
    useRef(false)


  const recommendationId =
    searchParams.get(
      "recommendation"
    )


  const recommendationScoreParam =
    searchParams.get(
      "score"
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


    hydratedRef.current =
      true


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


    if (initialTitle) {

      setTitle(

        stripRankingPrefix(
          initialTitle
        )

      )

    }


    if (initialCategory) {

      setCategory(
        initialCategory
      )

    }


    if (initialDescription) {

      setDescription(
        initialDescription
      )

    }

  }, [searchParams])


  function updateItem(
    id: string,
    value: string
  ) {

    setItems(

      current =>

        current.map(

          item =>

            item.id === id

              ? {
                  ...item,
                  name: value
                }

              : item

        )

    )

  }


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


  function removeItem(
    id: string
  ) {

    if (
      items.length <= 1
    ) {

      return

    }


    setItems(

      current =>

        current.filter(

          item =>
            item.id !== id

        )

    )

  }


  function moveItem(
    oldIndex: number,
    newIndex: number
  ) {

    setItems(

      current => {

        const next =
          [
            ...current
          ]


        const moved =
          next.splice(
            oldIndex,
            1
          )[0]


        next.splice(
          newIndex,
          0,
          moved
        )


        return next

      }

    )

  }


  async function handleSubmit(
    event: React.FormEvent
  ) {

    event.preventDefault()


    if (saving) {

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


    if (!cleanTitle) {

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

      const {
        data: {
          user
        }
      } = await supabase.auth.getUser()


      if (user) {

        await createSupabaseRanking(

          ranking,

          user.id

        )


        /*
         *
         * Taste Graph Baseline
         *
         * Every RANKD created by an
         * authenticated user contributes
         * initial taste signals.
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
         * Taste Graph Feedback Loop
         *
         * If this RANKD was created from
         * a Taste Recommendation, compare
         * the user's new ranking against
         * the original recommendation.
         *
         */


        if (recommendationId) {

          try {

            const recommendation =

              await getSupabaseRanking(

                recommendationId

              )


            if (recommendation) {

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

        return

      }


      const existing =

        JSON.parse(

          localStorage.getItem(
            "createdRankings"
          )
          ||
          "[]"

        )


      const localRanking = {

        ...ranking,

        creator:
          "You"

      }


      localStorage.setItem(

        "createdRankings",

        JSON.stringify(

          [
            ...existing,
            localRanking
          ]

        )

      )


      router.push(
        `/rank/${ranking.id}`
      )

    }

    catch (submitError) {

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


  return (

    <main className="min-h-screen">

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

        </div>


        <form
          onSubmit={handleSubmit}
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

              value={title}

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

              value={category}

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

              {
                categories.map(

                  option => (

                    <option
                      key={option}
                      value={option}
                    >

                      {option}

                    </option>

                  )

                )
              }

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

                items={items}

                setItems={setItems}

              />

            </div>


            {
              items.length < 7 && (

                <button

                  type="button"

                  onClick={addItem}

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

              )
            }

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

              value={description}

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


          {
            error && (

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

            )
          }


          <button

            type="submit"

            disabled={saving}

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

            {
              saving
                ? "Creating..."
                : "Create RANKD"
            }

          </button>

        </form>

      </div>

    </main>

  )

}