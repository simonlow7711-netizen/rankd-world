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
          "parentId"
        ) ??
        searchParams.get(
          "parent"
        )

      const rerankTitle =
        searchParams.get(
          "title"
        )

      const rerankCategory =
        searchParams.get(
          "category"
        )

      const rerankItems =
        searchParams.get(
          "items"
        )

      if(
        rerankTitle
        ||
        rerankCategory
        ||
        rerankItems
      ){

        if(rerankTitle){

          setTitle(
            rerankTitle
          )

        }

        if(
          rerankCategory &&
          isValidRankingCategory(
            rerankCategory
          )
        ){

          setCategory(
            rerankCategory
          )

        }

        if(rerankItems){

          const itemNames =
            rerankItems
              .split("|")
              .map(
                item =>
                  item.trim()
              )
              .filter(
                item =>
                  item.length > 0
              )
              .slice(
                0,
                7
              )

          if(
            itemNames.length ===
            7
          ){

            setItems(
              itemNames.map(
                name => ({
                  id:
                    crypto.randomUUID(),
                  name
                })
              )
            )

          }

        }

      }

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

        if(
          !rerankTitle
        ){

          setTitle(
            `RANKD ${stripRankingPrefix(
              ranking.title
            )}`
          )

        }

        if(
          !rerankCategory
        ){

          setCategory(
            ranking.category
          )

        }

        if(
          !rerankTitle
        ){

          setDescription(
            ranking.description
              ? `Remix of ${stripRankingPrefix(
                  ranking.title
                )}.`
              : ""
          )

        }

        if(
          !rerankItems
        ){

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

      }

      loadParent()

    },
    [
      hydrated,
      searchParams
    ]
  )


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


  const isRerank =
    Boolean(
      parentRanking
      ||
      searchParams.get(
        "parentId"
      )
      ||
      searchParams.get(
        "parent"
      )
    )


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
          w-full
          max-w-4xl
          px-5
          py-8
          sm:px-8
          sm:py-12
          lg:py-16
        "
      >

        <header
          className="
            mb-10
          "
        >

          <p
            className="
              mb-2
              text-xs
              font-black
              uppercase
              tracking-[0.18em]
              text-[#FF6B35]
            "
          >
            {isRerank
              ? "RE-RANKD"
              : "CREATE"
            }
          </p>


          <h1
            className="
              max-w-3xl
              text-4xl
              font-black
              leading-[0.95]
              tracking-[-0.04em]
              sm:text-6xl
            "
          >
            {isRerank
              ? "Rank it differently."
              : "Make your choices."
            }
          </h1>


          <p
            className="
              mt-4
              max-w-xl
              text-sm
              font-medium
              leading-6
              text-black/55
              sm:text-base
            "
          >
            {isRerank
              ? "Start with the existing choices. Change the order to make it yours."
              : "Seven choices. One order. Your opinion."
            }
          </p>

        </header>


        {isRerank && (

          <div
            className="
              mb-8
              border-l-4
              border-[#FF6B35]
              bg-white/70
              px-5
              py-4
              sm:px-6
            "
          >

            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.14em]
                text-black/45
              "
            >
              You are re-ranking
            </p>

            <p
              className="
                mt-1
                text-lg
                font-black
                leading-tight
              "
            >
              {stripRankingPrefix(
                title
              )}
            </p>

          </div>

        )}


        <section
          className="
            border-t-2
            border-black
          "
        >

          <div
            className="
              py-6
              sm:py-8
            "
          >

            <div
              className="
                grid
                gap-7
                sm:grid-cols-2
              "
            >

              <div
                className="
                  sm:col-span-2
                "
              >

                <label
                  htmlFor="title"
                  className="
                    mb-2
                    block
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.12em]
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
                  placeholder="What are you ranking?"
                  className="
                    w-full
                    border-b-2
                    border-black/15
                    bg-transparent
                    px-0
                    py-3
                    text-2xl
                    font-black
                    outline-none
                    transition
                    placeholder:text-black/20
                    focus:border-[#FF6B35]
                    sm:text-3xl
                  "
                />

              </div>


              <div>

                <label
                  htmlFor="category"
                  className="
                    mb-2
                    block
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.12em]
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
                    border-b-2
                    border-black/15
                    bg-transparent
                    px-0
                    py-3
                    text-base
                    font-bold
                    outline-none
                    transition
                    focus:border-[#FF6B35]
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
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.12em]
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
                  rows={2}
                  placeholder="Why did you make this RANKD?"
                  className="
                    w-full
                    resize-none
                    border-b-2
                    border-black/15
                    bg-transparent
                    px-0
                    py-3
                    text-base
                    font-medium
                    leading-6
                    outline-none
                    transition
                    placeholder:text-black/20
                    focus:border-[#FF6B35]
                  "
                />

              </div>

            </div>

          </div>

        </section>


        <section
          className="
            border-t-2
            border-black
          "
        >

          <div
            className="
              border-b
              border-black/10
              py-5
            "
          >

            <h2
              className="
                text-lg
                font-black
              "
            >
              Your Top 7
            </h2>

            <p
              className="
                mt-1
                text-xs
                font-medium
                text-black/50
              "
            >
              Put them in the order you believe.
            </p>

          </div>


          <div
            className="
              py-6
              sm:py-8
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

        </section>


        {error && (

          <div
            className="
              mb-6
              border-l-4
              border-red-500
              bg-red-50
              px-4
              py-3
              text-sm
              font-medium
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
            bg-[#FF6B35]
            px-6
            py-4
            text-base
            font-black
            text-white
            transition
            hover:bg-black
            disabled:cursor-not-allowed
            disabled:opacity-50
            sm:py-5
          "
        >

          {saving
            ? "Creating..."
            : isRerank
              ? "Publish RE-RANKD"
              : "Publish RANKD"
          }

        </button>


        <div
          className="
            mt-6
            text-center
            text-xs
            font-medium
            text-black/35
          "
        >
          Seven choices. Your order.
        </div>

      </div>

    </main>

  )

}