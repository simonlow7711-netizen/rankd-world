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

import {
  locations
} from "@/utils/locations"


export default function CreateClient(){

  const router =
    useRouter()

  const searchParams =
    useSearchParams()

  const [title,setTitle] =
    useState("")

  const [category,setCategory] =
    useState("")

  const [locationSlug,setLocationSlug] =
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

  const [addingLinks,setAddingLinks] =
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

          let parsedItems:
            RankingBuilderItem[] = []


          try{

            const parsed =
              JSON.parse(
                rerankItems
              )


            if(
              Array.isArray(
                parsed
              )
            ){

              parsedItems =
                parsed
                  .map(
                    item => {

                      if(
                        typeof item ===
                        "string"
                      ){

                        return {
                          id:
                            crypto.randomUUID(),
                          name:
                            item.trim()
                        }

                      }


                      if(
                        item &&
                        typeof item.name ===
                        "string"
                      ){

                        return {
                          id:
                            crypto.randomUUID(),
                          name:
                            item.name.trim(),
                          externalUrl:
                            typeof item.externalUrl ===
                            "string"
                              ? item.externalUrl
                              : undefined
                        }

                      }


                      return null

                    }
                  )
                  .filter(
                    (
                      item
                    ):item is RankingBuilderItem =>
                      item !== null &&
                      item.name.length > 0
                  )
                  .slice(
                    0,
                    7
                  )

            }

          }catch{

            parsedItems =
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
                .map(
                  name => ({
                    id:
                      crypto.randomUUID(),
                    name
                  })
                )

          }


          if(
            parsedItems.length ===
            7
          ){

            setItems(
              parsedItems
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
          ranking.location
        ){

          const matchingLocation =
            Object.entries(
              locations
            ).find(
              (
                [
                  ,
                  configuredLocation
                ]
              ) => {

                return (
                  configuredLocation.name
                    .toLowerCase() ===
                    ranking.location?.name
                      ?.toLowerCase()
                )

              }
            )

          if(
            matchingLocation
          ){

            setLocationSlug(
              matchingLocation[0]
            )

          }

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
                  item.name,
                externalUrl:
                  item.externalUrl
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


  function validateRanking():boolean{

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

      return false
    }


    if(
      !isValidRankingCategory(
        category
      )
    ){

      setError(
        "Please choose a category."
      )

      return false
    }


    if(
      cleanItems.length !== 7
    ){

      setError(
        "A RANKD must contain exactly 7 items."
      )

      return false
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

      return false
    }


    return true

  }


  function handleContinueToLinks(){

    if(saving){
      return
    }


    if(
      !validateRanking()
    ){

      return

    }


    setAddingLinks(true)

    window.scrollTo(
      {
        top:0,
        behavior:"smooth"
      }
    )

  }


  function handleSkipLinks(){

    if(saving){
      return
    }


    setAddingLinks(false)

    void handleCreate()

  }


  function updateItemLink(
    itemId:string,
    value:string
  ){

    setItems(
      currentItems =>
        currentItems.map(
          item =>
            item.id === itemId
              ? {
                  ...item,
                  externalUrl:
                    value
                      .trim()
                      .length > 0
                      ? value
                      : undefined
                }
              : item
        )
    )

  }


  function validateLinks():boolean{

    for(
      const item of items
    ){

      const url =
        item.externalUrl?.trim()


      if(!url){
        continue
      }


      try{

        const parsedUrl =
          new URL(
            url
          )


        if(
          parsedUrl.protocol !==
            "http:"
          &&
          parsedUrl.protocol !==
            "https:"
        ){

          setError(
            `Please enter a valid link for "${item.name}".`
          )

          return false

        }

      }catch{

        setError(
          `Please enter a valid link for "${item.name}".`
        )

        return false

      }

    }


    return true

  }


  async function handleCreate(){

    if(saving){
      return
    }

    setError("")


    if(
      !validateRanking()
    ){

      setAddingLinks(false)

      return

    }


    if(
      !validateLinks()
    ){

      return

    }


    setSaving(true)


    const cleanTitle =
      stripRankingPrefix(
        title.trim()
      )


    const finalCategory =
      category.trim()


    const finalParentId =
      parentRanking?.id ??
      null


    const finalRootId =
      parentRanking?.rootId ??
      parentRanking?.id ??
      null


    const selectedLocation =
      locationSlug
        ? locations[
            locationSlug
          ]
        : null


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
        items
          .filter(
            item =>
              item.name.trim().length > 0
          )
          .map(
            (
              item,
              index
            ) => ({
              position:
                index + 1,

              name:
                item.name.trim(),

              votes:
                0,

              externalUrl:
                item.externalUrl?.trim()
                  ? item.externalUrl.trim()
                  : undefined

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
        finalRootId,

      location:
        selectedLocation
          ? {
              name:
                selectedLocation.name,

              city:
                selectedLocation.city,

              state:
                selectedLocation.state,

              country:
                selectedLocation.country
            }
          : undefined

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


    const recommendationId =
      searchParams.get(
        "recommendation"
      )

    const recommendationScore =
      searchParams.get(
        "recommendationScore"
      )


    void Promise.all(
      [

        (
          async () => {

            if(
              !parentRanking?.creatorId
              ||
              parentRanking.creatorId === user.id
              ||
              !finalParentId
            ){

              return
            }

            try{

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

            }catch(
              notificationError
            ){

              console.error(
                "REMIX NOTIFICATION ERROR",
                notificationError
              )

            }

          }
        )(),


        (
          async () => {

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
                baselineSignals.length === 0
              ){

                return
              }

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

            }catch(
              tasteError
            ){

              console.error(
                "TASTE GRAPH BASELINE ERROR",
                tasteError
              )

            }

          }
        )(),


        (
          async () => {

            if(
              !recommendationId
              ||
              !recommendationScore
            ){

              return
            }

            try{

              const recommendation =
                await getSupabaseRanking(
                  recommendationId
                )

              if(!recommendation){
                return
              }

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
                feedbackSignals.length === 0
              ){

                return
              }

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

            }catch(
              feedbackError
            ){

              console.error(
                "TASTE GRAPH FEEDBACK ERROR",
                feedbackError
              )

            }

          }
        )()

      ]
    )


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


  const formatCountry =
    (
      country:string
    ):string => {

      if(
        country ===
        "United Kingdom"
      ){

        return "UK"

      }

      if(
        country ===
        "United States"
      ){

        return "US"

      }

      if(
        country ===
        "Philippines"
      ){

        return "PH"

      }

      return country

    }


  if(addingLinks){

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
            py-10
            sm:px-8
            sm:py-14
            lg:py-20
          "
        >

          <header
            className="
              mb-10
              max-w-2xl
            "
          >

            <div
              className="
                mb-5
                flex
                items-center
                gap-3
              "
            >

              <span
                className="
                  rounded-full
                  bg-[#FF6B35]/10
                  px-3
                  py-1.5
                  text-[10px]
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
              </span>

              <span
                className="
                  text-xs
                  font-bold
                  text-black/30
                "
              >
                Step 2 of 2
              </span>

            </div>


            <h1
              className="
                text-5xl
                font-black
                leading-[0.9]
                tracking-[-0.055em]
                sm:text-7xl
              "
            >
              Add links?
            </h1>


            <p
              className="
                mt-5
                max-w-xl
                text-base
                font-medium
                leading-7
                text-black/55
                sm:text-lg
              "
            >
              Make your Top 7 more useful by linking each choice to where people can find it.
            </p>

          </header>


          <section
            className="
              overflow-hidden
              rounded-3xl
              border
              border-black/[0.08]
              bg-white/65
              shadow-[0_18px_50px_rgba(0,0,0,0.05)]
            "
          >

            <div
              className="
                border-b
                border-black/[0.07]
                px-5
                py-5
                sm:px-7
                sm:py-6
              "
            >

              <h2
                className="
                  text-lg
                  font-black
                  tracking-tight
                "
              >
                Your Top 7
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                  text-black/45
                "
              >
                Add as many or as few as you like.
              </p>

            </div>


            <div>

              {items.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={item.id}
                    className="
                      border-b
                      border-black/[0.07]
                      px-5
                      py-5
                      last:border-b-0
                      sm:px-7
                      sm:py-6
                    "
                  >

                    <div
                      className="
                        mb-3
                        flex
                        items-center
                        gap-4
                      "
                    >

                      <span
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#FF6B35]/10
                          text-[11px]
                          font-black
                          text-[#FF6B35]
                        "
                      >
                        {index + 1}
                      </span>

                      <p
                        className="
                          text-base
                          font-black
                          leading-tight
                          sm:text-lg
                        "
                      >
                        {item.name}
                      </p>

                    </div>


                    <input
                      type="url"
                      value={
                        item.externalUrl ??
                        ""
                      }
                      onChange={
                        event =>
                          updateItemLink(
                            item.id,
                            event.target.value
                          )
                      }
                      placeholder="Paste link (optional)"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-black/[0.08]
                        bg-[#F7F4EE]/70
                        px-4
                        py-3
                        text-sm
                        font-medium
                        outline-none
                        transition
                        placeholder:text-black/25
                        focus:border-[#FF6B35]/50
                        focus:bg-white
                        focus:ring-4
                        focus:ring-[#FF6B35]/[0.06]
                      "
                    />

                  </div>

                )
              )}

            </div>

          </section>


          {error && (

            <div
              className="
                mt-6
                rounded-2xl
                border
                border-red-200
                bg-red-50
                px-5
                py-4
                text-sm
                font-medium
                text-red-700
              "
            >
              {error}
            </div>

          )}


          <div
            className="
              mt-8
              flex
              flex-col-reverse
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <button
              type="button"
              onClick={
                () => {
                  setAddingLinks(false)
                  setError("")
                  window.scrollTo(
                    {
                      top:0,
                      behavior:"smooth"
                    }
                  )
                }
              }
              disabled={
                saving
              }
              className="
                rounded-full
                px-5
                py-3
                text-sm
                font-black
                text-black/45
                transition
                hover:bg-black/[0.04]
                hover:text-black
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Back to ranking
            </button>


            <div
              className="
                flex
                flex-col
                gap-3
                sm:flex-row
              "
            >

              <button
                type="button"
                onClick={
                  handleSkipLinks
                }
                disabled={
                  saving
                }
                className="
                  rounded-full
                  border
                  border-black/[0.12]
                  bg-white/60
                  px-6
                  py-3.5
                  text-sm
                  font-black
                  text-black
                  transition
                  hover:border-black
                  hover:bg-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {saving
                  ? "Creating..."
                  : "Skip links"
                }
              </button>


              <button
                type="button"
                onClick={
                  handleCreate
                }
                disabled={
                  saving
                }
                className="
                  rounded-full
                  bg-[#FF6B35]
                  px-7
                  py-3.5
                  text-sm
                  font-black
                  text-white
                  shadow-[0_8px_24px_rgba(255,107,53,0.18)]
                  transition
                  hover:bg-black
                  hover:shadow-none
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {saving
                  ? "Creating..."
                  : isRerank
                    ? "Publish RE-RANKD"
                    : "Publish RANKD"
                }
              </button>

            </div>

          </div>


          <div
            className="
              mt-8
              text-center
              text-xs
              font-medium
              text-black/30
            "
          >
            Seven choices. Your order.
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
          w-full
          max-w-5xl
          px-5
          py-10
          sm:px-8
          sm:py-14
          lg:py-20
        "
      >

        <header
          className="
            mb-12
            max-w-3xl
          "
        >

          <div
            className="
              mb-5
              flex
              items-center
              gap-3
            "
          >

            <span
              className="
                rounded-full
                bg-[#FF6B35]/10
                px-3
                py-1.5
                text-[10px]
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
            </span>

            {isRerank && (

              <span
                className="
                  text-xs
                  font-bold
                  text-black/30
                "
              >
                Change the order. Make it yours.
              </span>

            )}

          </div>


          <h1
            className="
              max-w-3xl
              text-5xl
              font-black
              leading-[0.9]
              tracking-[-0.055em]
              sm:text-7xl
            "
          >
            {isRerank
              ? "Rank it differently."
              : "Make your choices."
            }
          </h1>


          <p
            className="
              mt-5
              max-w-xl
              text-base
              font-medium
              leading-7
              text-black/50
              sm:text-lg
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
              flex
              items-center
              gap-4
              rounded-2xl
              border
              border-black/[0.07]
              bg-white/60
              px-5
              py-4
              shadow-[0_8px_30px_rgba(0,0,0,0.03)]
              sm:px-6
            "
          >

            <span
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#FF6B35]/10
                text-xs
                font-black
                text-[#FF6B35]
              "
            >
              ↻
            </span>

            <div>

              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-black/35
                "
              >
                You are re-ranking
              </p>

              <p
                className="
                  mt-0.5
                  text-base
                  font-black
                  leading-tight
                "
              >
                {stripRankingPrefix(
                  title
                )}
              </p>

            </div>

          </div>

        )}


        <section
          className="
            rounded-3xl
            border
            border-black/[0.08]
            bg-white/55
            p-5
            shadow-[0_18px_50px_rgba(0,0,0,0.04)]
            sm:p-8
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
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-black/45
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
                  rounded-2xl
                  border
                  border-black/[0.08]
                  bg-[#F7F4EE]/65
                  px-4
                  py-4
                  text-2xl
                  font-black
                  outline-none
                  transition
                  placeholder:text-black/20
                  focus:border-[#FF6B35]/50
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#FF6B35]/[0.06]
                  sm:px-5
                  sm:py-5
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
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-black/45
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
                  appearance-none
                  rounded-2xl
                  border
                  border-black/[0.08]
                  bg-[#F7F4EE]/65
                  px-4
                  py-4
                  text-sm
                  font-bold
                  outline-none
                  transition
                  focus:border-[#FF6B35]/50
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#FF6B35]/[0.06]
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
                htmlFor="location"
                className="
                  mb-2
                  block
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-black/45
                "
              >
                Location
              </label>

              <select
                id="location"
                value={locationSlug}
                onChange={
                  event =>
                    setLocationSlug(
                      event.target.value
                    )
                }
                className="
                  w-full
                  appearance-none
                  rounded-2xl
                  border
                  border-black/[0.08]
                  bg-[#F7F4EE]/65
                  px-4
                  py-4
                  text-sm
                  font-bold
                  outline-none
                  transition
                  focus:border-[#FF6B35]/50
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#FF6B35]/[0.06]
                "
              >

                <option value="">
                  No location
                </option>

                {Object.entries(
                  locations
                ).map(
                  (
                    [
                      slug,
                      location
                    ]
                  ) => {

                    const locationLabel =
                      [
                        location.name,
                        location.cityLevel
                          ? ""
                          : location.city,
                        location.state,
                        formatCountry(
                          location.country
                        )
                      ]
                        .filter(Boolean)
                        .join(" · ")

                    return (

                      <option
                        key={slug}
                        value={slug}
                      >
                        {locationLabel}
                      </option>

                    )

                  }
                )}

              </select>

            </div>


            <div
              className="
                sm:col-span-2
              "
            >

              <label
                htmlFor="description"
                className="
                  mb-2
                  block
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-black/45
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
                rows={3}
                placeholder="Why did you make this RANKD?"
                className="
                  w-full
                  resize-none
                  rounded-2xl
                  border
                  border-black/[0.08]
                  bg-[#F7F4EE]/65
                  px-4
                  py-4
                  text-sm
                  font-medium
                  leading-6
                  outline-none
                  transition
                  placeholder:text-black/20
                  focus:border-[#FF6B35]/50
                  focus:bg-white
                  focus:ring-4
                  focus:ring-[#FF6B35]/[0.06]
                  sm:px-5
                "
              />

            </div>

          </div>

        </section>


        <section
          className="
            mt-8
          "
        >

          <div
            className="
              mb-5
              flex
              items-end
              justify-between
              gap-4
            "
          >

            <div>

              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.15em]
                  text-[#FF6B35]
                "
              >
                The important bit
              </p>

              <h2
                className="
                  mt-1
                  text-2xl
                  font-black
                  tracking-tight
                "
              >
                Your Top 7
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                  text-black/45
                "
              >
                Put them in the order you believe.
              </p>

            </div>


            <span
              className="
                hidden
                rounded-full
                bg-black/[0.04]
                px-3
                py-1.5
                text-[10px]
                font-black
                uppercase
                tracking-[0.12em]
                text-black/35
                sm:block
              "
            >
              7 choices
            </span>

          </div>


          <div
            className="
              overflow-hidden
              rounded-3xl
              border
              border-black/[0.08]
              bg-white/70
              p-3
              shadow-[0_18px_50px_rgba(0,0,0,0.05)]
              sm:p-4
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
              mt-6
              rounded-2xl
              border
              border-red-200
              bg-red-50
              px-5
              py-4
              text-sm
              font-medium
              text-red-700
            "
          >
            {error}
          </div>

        )}


        <div
          className="
            mt-8
            rounded-3xl
            border
            border-black/[0.07]
            bg-white/45
            p-4
            sm:p-5
          "
        >

          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <div>

              <p
                className="
                  text-sm
                  font-black
                "
              >
                Ready?

              </p>

              <p
                className="
                  mt-1
                  text-xs
                  font-medium
                  text-black/40
                "
              >
                You can add links to your choices on the next step.
              </p>

            </div>


            <button
              type="button"
              onClick={
                handleContinueToLinks
              }
              disabled={
                saving
              }
              className="
                rounded-full
                bg-[#FF6B35]
                px-7
                py-3.5
                text-sm
                font-black
                text-white
                shadow-[0_8px_24px_rgba(255,107,53,0.16)]
                transition
                hover:bg-black
                hover:shadow-none
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:shrink-0
              "
            >
              Continue · Add links
            </button>

          </div>

        </div>


        <div
          className="
            mt-8
            text-center
            text-xs
            font-medium
            text-black/25
          "
        >
          Seven choices. Your order.
        </div>

      </div>

    </main>

  )

}