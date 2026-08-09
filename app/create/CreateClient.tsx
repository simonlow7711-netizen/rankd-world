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
  "Gaming",
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


    if (
      initialCategory &&
      categories.includes(
        initialCategory
      )
    ) {

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
          w-full
          max-w-5xl
          px-5
          py-10
          sm:px-6
          sm:py-12
          lg:px-8
          lg:py-16
        "
      >

        <header
          className="
            mb-10
            max-w-3xl
            sm:mb-12
          "
        >

          <p
            className="
              rankd-accent
              text-xs
              font-black
              uppercase
              tracking-[0.2em]
            "
          >

            Create

          </p>


          <h1
            className="
              mt-3
              text-4xl
              font-black
              leading-[0.95]
              tracking-tight
              sm:text-5xl
              lg:text-6xl
            "
          >

            Make your Top 7.

          </h1>


          <p
            className="
              mt-5
              max-w-2xl
              text-base
              leading-7
              opacity-60
              sm:text-lg
            "
          >

            Your choices help build your personal taste graph.

          </p>

        </header>


        <form
          onSubmit={handleSubmit}
          className="
            space-y-6
          "
        >

          <section
            className="
              rankd-card
              overflow-hidden
            "
          >

            <div
              className="
                border-b
                px-6
                py-5
                sm:px-8
              "
            >

              <label
                className="
                  block
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.18em]
                "
              >

                Title

              </label>


              <p
                className="
                  mt-1.5
                  text-sm
                  opacity-50
                "
              >

                Give your RANKD a clear name.

              </p>

            </div>


            <div
              className="
                px-6
                py-6
                sm:px-8
              "
            >

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
                  w-full
                  rounded-xl
                  border
                  bg-transparent
                  px-4
                  py-3.5
                  text-base
                  font-bold
                  outline-none
                  transition
                  placeholder:opacity-35
                  focus:ring-2
                  focus:ring-black/10
                "

              />

            </div>

          </section>


          <section
            className="
              rankd-card
              overflow-hidden
            "
          >

            <div
              className="
                border-b
                px-6
                py-5
                sm:px-8
              "
            >

              <label
                className="
                  block
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.18em]
                "
              >

                Category

              </label>


              <p
                className="
                  mt-1.5
                  text-sm
                  opacity-50
                "
              >

                Choose the category that best fits your RANKD.

              </p>

            </div>


            <div
              className="
                grid
                grid-cols-2
                gap-2
                p-4
                sm:grid-cols-3
                sm:p-6
                lg:grid-cols-5
              "
            >

              {
                categories.map(

                  option => {

                    const selected =
                      category === option


                    return (

                      <button

                        key={option}

                        type="button"

                        onClick={
                          () =>
                            setCategory(
                              option
                            )
                        }

                        aria-pressed={
                          selected
                        }

                        className={`
                          rounded-xl
                          border
                          px-3
                          py-3
                          text-sm
                          font-black
                          transition
                          ${
                            selected
                              ? "rankd-primary border-transparent"
                              : "bg-transparent opacity-60 hover:opacity-100"
                          }
                        `}

                      >

                        {option}

                      </button>

                    )

                  }

                )
              }

            </div>

          </section>


          <section
            className="
              rankd-card
              overflow-hidden
            "
          >

            <div
              className="
                flex
                items-end
                justify-between
                gap-4
                border-b
                px-6
                py-5
                sm:px-8
              "
            >

              <div>

                <label
                  className="
                    block
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.18em]
                  "
                >

                  Your Top 7

                </label>


                <p
                  className="
                    mt-1.5
                    text-sm
                    opacity-50
                  "
                >

                  Put your choices in order.

                </p>

              </div>


              <div
                className="
                  shrink-0
                  text-xs
                  font-black
                  opacity-50
                "
              >

                {items.length} / 7

              </div>

            </div>


            <div
              className="
                px-6
                py-6
                sm:px-8
              "
            >

              <SortableRankingList

                items={items}

                setItems={setItems}

              />


              {
                items.length < 7 && (

                  <button

                    type="button"

                    onClick={addItem}

                    className="
                      mt-5
                      rounded-xl
                      border
                      px-4
                      py-2.5
                      text-sm
                      font-black
                      opacity-70
                      transition
                      hover:opacity-100
                    "

                  >

                    Add item

                  </button>

                )
              }

            </div>

          </section>


          <section
            className="
              rankd-card
              overflow-hidden
            "
          >

            <div
              className="
                border-b
                px-6
                py-5
                sm:px-8
              "
            >

              <label
                className="
                  block
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.18em]
                "
              >

                Description

              </label>


              <p
                className="
                  mt-1.5
                  text-sm
                  opacity-50
                "
              >

                Add a little context if you want to.

              </p>

            </div>


            <div
              className="
                px-6
                py-6
                sm:px-8
              "
            >

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
                  w-full
                  resize-none
                  rounded-xl
                  border
                  bg-transparent
                  px-4
                  py-3.5
                  text-base
                  outline-none
                  transition
                  placeholder:opacity-35
                  focus:ring-2
                  focus:ring-black/10
                "

              />

            </div>

          </section>


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
              pt-2
            "
          >

            <button

              type="submit"

              disabled={saving}

              className="
                rankd-primary
                w-full
                rounded-xl
                px-6
                py-4
                text-base
                font-black
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:py-4.5
              "

            >

              {
                saving
                  ? "Creating..."
                  : "Create RANKD"
              }

            </button>

          </div>

        </form>

      </div>

    </main>

  )

}