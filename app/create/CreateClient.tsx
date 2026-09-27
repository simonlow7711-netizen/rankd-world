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


    /*
     * The RANKD is now published.
     *
     * Everything below this point is post-publication
     * enrichment and should not delay the user seeing
     * their newly published RANKD.
     */

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

        /*
         * Remix notification
         */

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


        /*
         * Taste Graph baseline
         */

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


        /*
         * Recommendation feedback
         */

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


    /*
     * Do not wait for post-publication processing.
     *
     * The ranking already exists in Supabase, so take
     * the user directly to the published RANKD.
     */

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
              Add links?
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
              Make your Top 7 more useful by linking each choice to where people can find it.
            </p>

          </header>


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
                Links are optional. Add as many or as few as you like.
              </p>

            </div>


            <div
              className="
                divide-y
                divide-black/10
              "
            >

              {items.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={item.id}
                    className="
                      py-5
                      sm:py-6
                    "
                  >

                    <div
                      className="
                        mb-3
                        flex
                        items-start
                        gap-4
                      "
                    >

                      <span
                        className="
                          shrink-0
                          text-xs
                          font-black
                          uppercase
                          tracking-[0.12em]
                          text-[#FF6B35]
                        "
                      >
                        #{index + 1}
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
                        border-b-2
                        border-black/15
                        bg-transparent
                        px-0
                        py-3
                        text-sm
                        font-medium
                        outline-none
                        transition
                        placeholder:text-black/25
                        focus:border-[#FF6B35]
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


          <div
            className="
              mt-8
              grid
              gap-3
              sm:grid-cols-2
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
                w-full
                border-2
                border-black
                bg-transparent
                px-6
                py-4
                text-base
                font-black
                text-black
                transition
                hover:bg-black
                hover:text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:py-5
              "
            >
              {saving
                ? "Creating..."
                : "Skip links & publish"
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

          </div>


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
              mx-auto
              mt-5
              block
              text-xs
              font-black
              uppercase
              tracking-[0.12em]
              text-black/40
              transition
              hover:text-black
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Back to ranking
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
                  htmlFor="location"
                  className="
                    mb-2
                    block
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.12em]
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
            handleContinueToLinks
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

          Continue · Add links

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