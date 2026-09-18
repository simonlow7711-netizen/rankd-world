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


export default function CreateClient(){

  const router =
    useRouter()

  const searchParams =
    useSearchParams()

  const [title,setTitle] =
    useState("")

  const [category,setCategory] =
    useState("")

  const [description,setDescription] =
    useState("")

  const [items,setItems] =
    useState<RankingBuilderItem[]>(
      [
        {
          id:crypto.randomUUID(),
          name:""
        },
        {
          id:crypto.randomUUID(),
          name:""
        },
        {
          id:crypto.randomUUID(),
          name:""
        },
        {
          id:crypto.randomUUID(),
          name:""
        },
        {
          id:crypto.randomUUID(),
          name:""
        },
        {
          id:crypto.randomUUID(),
          name:""
        },
        {
          id:crypto.randomUUID(),
          name:""
        }
      ]
    )

  const [saving,setSaving] =
    useState(false)

  const [error,setError] =
    useState("")

  const [hydrated,setHydrated] =
    useState(false)

  const [parentRanking,setParentRanking] =
    useState<Ranking | null>(null)

  const hasLoadedParent =
    useRef(false)


  useEffect(
    () => {

      setHydrated(true)

    },
    []
  )


  useEffect(
    () => {

      if(
        !hydrated
        ||
        hasLoadedParent.current
      ){
        return
      }

      const parentId =
        searchParams.get(
          "parent"
        )

      if(!parentId){

        hasLoadedParent.current =
          true

        return
      }

      hasLoadedParent.current =
        true

      const parentRankingId =
        parentId

      async function loadParent(){

        const ranking =
          await getSupabaseRanking(
            parentRankingId
          )

        if(!ranking){
          return
        }

        setParentRanking(
          ranking
        )

        setTitle(
          `RANKD ${stripRankingPrefix(
            ranking.title
          )}`
        )

        setCategory(
          ranking.category
        )

        setDescription(
          ranking.description
            ? `Remix of ${stripRankingPrefix(
                ranking.title
              )}.`
            : ""
        )

        setItems(
          ranking.items.map(
            item => ({
              id:
                crypto.randomUUID(),
              name:
                item.name
            })
          )
        )

      }

      loadParent()

    },
    [
      hydrated,
      searchParams
    ]
  )


  function updateItem(
    id:string,
    name:string
  ){

    setItems(
      current =>
        current.map(
          item =>
            item.id === id
              ? {
                  ...item,
                  name
                }
              : item
        )
    )

  }


  function handleItemsChange(
    nextItems:RankingBuilderItem[]
  ){

    setItems(
      nextItems
    )

  }


  async function handleCreate(){

    if(saving){
      return
    }

    setError("")

    const cleanTitle =
      stripRankingPrefix(
        title.trim()
      )

    const cleanItems =
      items
        .map(
          item =>
            item.name.trim()
        )
        .filter(
          name =>
            name.length > 0
        )

    if(!cleanTitle){

      setError(
        "Please enter a title."
      )

      return
    }

    if(
      !isValidRankingCategory(
        category
      )
    ){

      setError(
        "Please choose a category."
      )

      return
    }

    if(
      cleanItems.length !== 7
    ){

      setError(
        "A RANKD must contain exactly 7 items."
      )

      return
    }

    const uniqueItems =
      new Set(
        cleanItems.map(
          item =>
            item.toLowerCase()
        )
      )

    if(
      uniqueItems.size !==
      cleanItems.length
    ){

      setError(
        "Each item must be different."
      )

      return
    }

    setSaving(true)

    const finalCategory =
      category.trim()

    const finalParentId =
      parentRanking?.id ??
      null

    const finalRootId =
      parentRanking?.rootId ??
      parentRanking?.id ??
      null

    const ranking:Ranking = {

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
        parentRanking
          ? "remix"
          : "community",

      parentId:
        finalParentId,

      rootId:
        finalRootId

    }


    let {
      data:{
        user
      }
    } =
      await supabase.auth.getUser()


    if(!user){

      const {
        data,
        error:anonymousAuthError
      } =
        await supabase.auth.signInAnonymously()

      if(
        anonymousAuthError
        ||
        !data.user
      ){

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


    const createdRanking =
      await createSupabaseRanking(
        ranking,
        user.id
      )


    if(
      !createdRanking
    ){

      setError(
        "Unable to create your RANKD. Please try again."
      )

      setSaving(false)

      return
    }


    const publishedRankingId =
      createdRanking.id


    const publishedRanking:Ranking = {

      ...ranking,

      id:
        publishedRankingId

    }


    if(
      parentRanking?.creatorId
      &&
      parentRanking.creatorId !== user.id
      &&
      finalParentId
    ){

      await createRemixNotification({
        recipientUserId:
          parentRanking.creatorId,

        actorUserId:
          user.id,

        originalRankingId:
          finalParentId,

        remixRankingId:
          publishedRankingId

      })

    }


    try{

      const existingGraph =
        await getTasteGraph(
          user.id
        )

      const baselineSignals =
        buildTasteBaselineSignals(
          user.id,
          publishedRanking
        )

      if(
        baselineSignals.length > 0
      ){

        const baselineGraph:TasteGraph = {

          ...existingGraph,

          signals:[
            ...existingGraph.signals,

            ...baselineSignals
          ]

        }

        await saveTasteGraph(
          baselineGraph
        )

      }

    }catch(
      tasteError
    ){

      console.error(
        "TASTE GRAPH BASELINE ERROR",
        tasteError
      )

    }


    const recommendationId =
      searchParams.get(
        "recommendation"
      )

    const recommendationScore =
      searchParams.get(
        "recommendationScore"
      )

    if(
      recommendationId
      &&
      recommendationScore
    ){

      try{

        const recommendation =
          await getSupabaseRanking(
            recommendationId
          )

        if(recommendation){

          const existingGraph =
            await getTasteGraph(
              user.id
            )

          const comparison =
            compareTasteFeedback(
              recommendation,
              publishedRanking,
              Number(
                recommendationScore
              )
            )

          const feedbackSignals =
            buildTasteFeedbackSignals(
              user.id,
              recommendation,
              publishedRanking,
              comparison
            )

          if(
            feedbackSignals.length > 0
          ){

            const feedbackGraph:TasteGraph = {

              ...existingGraph,

              signals:[
                ...existingGraph.signals,

                ...feedbackSignals
              ]

            }

            await saveTasteGraph(
              feedbackGraph
            )

          }

        }

      }catch(
        feedbackError
      ){

        console.error(
          "TASTE GRAPH FEEDBACK ERROR",
          feedbackError
        )

      }

    }


    router.push(
      `/rank/${publishedRankingId}`
    )

  }


  if(!hydrated){

    return null

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
          max-w-4xl
          px-4
          py-8
          sm:px-6
          sm:py-12
        "
      >

        <div
          className="
            mb-8
            text-center
          "
        >

          <h1
            className="
              text-3xl
              font-black
              tracking-tight
              sm:text-4xl
            "
          >
            Create a RANKD
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-black/60
              sm:text-base
            "
          >
            Make your choices. Put them in order.
          </p>

        </div>


        <section
          className="
            rounded-3xl
            border
            border-black/10
            bg-white
            p-5
            shadow-sm
            sm:p-8
          "
        >

          <div
            className="
              grid
              gap-6
            "
          >

            <div>

              <label
                htmlFor="title"
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                "
              >
                Title
              </label>

              <input
                id="title"
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
                  rounded-2xl
                  border
                  border-black/15
                  bg-[#F7F4EE]
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:border-[#FF6B35]
                  focus:ring-2
                  focus:ring-[#FF6B35]/20
                "
              />

            </div>


            <div>

              <label
                htmlFor="category"
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                "
              >
                Category
              </label>

              <select
                id="category"
                value={category}
                onChange={
                  event =>
                    setCategory(
                      event.target.value
                    )
                }
                className="
                  w-full
                  rounded-2xl
                  border
                  border-black/15
                  bg-[#F7F4EE]
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:border-[#FF6B35]
                  focus:ring-2
                  focus:ring-[#FF6B35]/20
                "
              >

                <option value="">
                  Choose a category
                </option>

                {categories.map(
                  item => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}

              </select>

            </div>


            <div>

              <label
                htmlFor="description"
                className="
                  mb-2
                  block
                  text-sm
                  font-bold
                "
              >
                Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={
                  event =>
                    setDescription(
                      event.target.value
                    )
                }
                rows={4}
                placeholder="Why did you make this RANKD?"
                className="
                  w-full
                  resize-none
                  rounded-2xl
                  border
                  border-black/15
                  bg-[#F7F4EE]
                  px-4
                  py-3
                  outline-none
                  transition
                  focus:border-[#FF6B35]
                  focus:ring-2
                  focus:ring-[#FF6B35]/20
                "
              />

            </div>


            <div>

              <div
                className="
                  mb-3
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <h2
                    className="
                      text-sm
                      font-bold
                    "
                  >
                    Your Top 7
                  </h2>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-black/50
                    "
                  >
                    Drag to put your choices in order.
                  </p>

                </div>

                <div
                  className="
                    text-sm
                    font-black
                    text-[#FF6B35]
                  "
                >
                  7 items
                </div>

              </div>


              <SortableRankingList
                items={
                  items
                }
                setItems={
                  setItems
                }
              />

            </div>


            {error && (

              <div
                className="
                  rounded-2xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-700
                "
              >
                {error}
              </div>

            )}


            <button
              type="button"
              onClick={
                handleCreate
              }
              disabled={
                saving
              }
              className="
                w-full
                rounded-2xl
                bg-[#FF6B35]
                px-5
                py-4
                text-base
                font-black
                text-white
                transition
                hover:opacity-90
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {saving
                ? "Creating..."
                : "Create RANKD"
              }

            </button>

          </div>

        </section>

      </div>

    </main>

  )

}