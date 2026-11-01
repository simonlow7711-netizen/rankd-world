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

import {
  isHttpUrl
} from "@/utils/linkText"

import EditionChrome from "@/components/EditionChrome"

import EditionHeader, {
  EditionMark,
  EditionTitle
} from "@/components/EditionHeader"

import EntryEmbeds from "@/components/EntryEmbeds"

import {
  getCategoryTheme
} from "@/utils/categoryTheme"


const fieldClass =
  `
    w-full
    rounded-2xl
    border
    border-black
    bg-transparent
    px-4
    py-4
    outline-none
    placeholder:text-black/25
    sm:px-5
  `

const labelClass =
  `
    mb-2
    block
    text-center
    text-[10px]
    font-black
    uppercase
    tracking-[0.18em]
    text-black/45
  `


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

  const [mediaUrl,setMediaUrl] =
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

  const [editingLinkId,setEditingLinkId] =
    useState<string | null>(
      null
    )

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


    const heroMedia =
      mediaUrl.trim()

    if (
      heroMedia &&
      !isHttpUrl(heroMedia)
    ) {
      setError(
        "Please enter a valid hero media link, or leave it blank."
      )

      return false
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

      mediaUrl:
        mediaUrl.trim()
          ? mediaUrl.trim()
          : null,

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
                  : undefined,

              commentary:
                item.commentary?.trim()
                  ? item.commentary.trim()
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


  const editionCategory =
    isValidRankingCategory(
      category
    )
      ? category
      : "General"

  const theme =
    getCategoryTheme(
      editionCategory
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
            max-w-5xl
            px-5
            py-10
            sm:px-8
            sm:py-14
            lg:py-20
          "
        >

          <section
            className="
              rankd-edition
              relative
              mb-8
              overflow-hidden
              rounded-[28px]
              border
              px-6
              pb-10
              pt-10
              text-center
              md:px-12
              md:pb-14
              md:pt-12
            "
            style={{
              backgroundColor:
                theme.paper,
              borderColor:
                "#111111"
            }}
          >

            <EditionChrome
              theme={theme}
            />

            <div
              className="
                relative
                z-10
              "
            >

              <EditionHeader
                theme={theme}
                category={editionCategory}
                bleed="page"
              >

                <p
                  className="
                    text-[11px]
                    font-black
                    uppercase
                    tracking-[0.22em]
                  "
                  style={{
                    color:
                      theme.accent
                  }}
                >
                  <EditionMark
                    theme={theme}
                  >
                    {
                      isRerank
                        ? "RE-RANKD / LINKS"
                        : "CREATE / LINKS"
                    }
                  </EditionMark>
                </p>

                <h1
                  className={`
                    mx-auto
                    mt-5
                    max-w-3xl
                    text-4xl
                    font-black
                    text-balance
                    hyphens-none
                    md:text-6xl
                    ${theme.titleClass}
                  `}
                >
                  <EditionTitle
                    theme={theme}
                  >
                    {
                      isRerank
                        ? "Edit your links"
                        : "Add links?"
                    }
                  </EditionTitle>
                </h1>

              </EditionHeader>

              <p
                className="
                  relative
                  z-10
                  mx-auto
                  -mt-12
                  max-w-xl
                  text-base
                  font-medium
                  leading-7
                  text-black/55
                  sm:text-lg
                "
              >
                {
                  isRerank
                    ? "Keep, change or remove the links attached to each choice."
                    : "Make your Top 7 more useful by linking each choice to where people can find it."
                }
              </p>

            </div>

          </section>


          <section
            className="
              rankd-edition
              relative
              overflow-hidden
              rounded-[28px]
              border
              text-center
            "
            style={{
              backgroundColor:
                theme.paper,
              borderColor:
                "#111111"
            }}
          >

            <EditionChrome
              theme={theme}
            />

            <div
              className="
                relative
                z-10
                border-b
                border-black
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
                {isRerank
                  ? "Edit any existing link or add one to a choice."
                  : "Add as many or as few as you like."
                }
              </p>

            </div>


            <div>

              {items.map(
                (
                  item,
                  index
                ) => {

                  const hasLink =
                    Boolean(
                      item.externalUrl?.trim()
                    )

                  const isEditing =
                    editingLinkId ===
                    item.id

                  return (

                    <div
                      key={item.id}
                      className="
                        border-b
                        border-black
                        px-5
                        py-5
                        last:border-b-0
                        sm:px-7
                        sm:py-6
                      "
                    >

                      <div
                        className="
                          flex
                          items-start
                          gap-4
                          text-left
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
                            border
                            border-black
                            bg-transparent
                            text-[11px]
                            font-black
                          "
                          style={{
                            color:
                              theme.accent
                          }}
                        >
                          {index + 1}
                        </span>


                        <div
                          className="
                            min-w-0
                            flex-1
                          "
                        >

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


                          {!hasLink &&
                            !isEditing && (

                            <button
                              type="button"
                              onClick={
                                () =>
                                  setEditingLinkId(
                                    item.id
                                  )
                              }
                              className="
                                mt-3
                                rounded-full
                                border
                                border-black
                                bg-transparent
                                px-4
                                py-2
                                text-xs
                                font-black
                              "
                            >
                              + Add link
                            </button>

                          )}


                          {hasLink &&
                            !isEditing && (

                            <div
                              className="
                                mt-3
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                              "
                            >

                              <div
                                className="
                                  min-w-0
                                  flex-1
                                "
                              >

                                <p
                                  className="
                                    truncate
                                    text-xs
                                    font-medium
                                    text-black/40
                                  "
                                >
                                  {item.externalUrl}
                                </p>

                              </div>


                              <div
                                className="
                                  flex
                                  shrink-0
                                  items-center
                                  gap-2
                                "
                              >

                                <button
                                  type="button"
                                  onClick={
                                    () =>
                                      setEditingLinkId(
                                        item.id
                                      )
                                  }
                                  className="
                                    rounded-full
                                    border
                                    border-black
                                    bg-transparent
                                    px-3
                                    py-2
                                    text-xs
                                    font-black
                                  "
                                >
                                  Edit
                                </button>


                                <button
                                  type="button"
                                  onClick={
                                    () => {

                                      updateItemLink(
                                        item.id,
                                        ""
                                      )

                                      setEditingLinkId(
                                        null
                                      )

                                    }
                                  }
                                  className="
                                    rounded-full
                                    border
                                    border-black
                                    bg-transparent
                                    px-3
                                    py-2
                                    text-xs
                                    font-black
                                  "
                                >
                                  Remove
                                </button>

                              </div>

                            </div>

                          )}


                          {isEditing && (

                            <div
                              className="
                                mt-3
                              "
                            >

                              <input
                                type="url"
                                autoFocus
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
                                placeholder="Paste link"
                                className="
                                  w-full
                                  rounded-xl
                                  border
                                  border-black
                                  bg-transparent
                                  px-4
                                  py-3
                                  text-sm
                                  font-medium
                                  outline-none
                                  placeholder:text-black/25
                                "
                              />


                              <div
                                className="
                                  mt-2
                                  flex
                                  items-center
                                  justify-between
                                  gap-4
                                "
                              >

                                <p
                                  className="
                                    text-[11px]
                                    font-medium
                                    text-black/30
                                  "
                                >
                                  Paste a YouTube, Spotify, Maps or any other link.
                                </p>


                                <button
                                  type="button"
                                  onClick={
                                    () =>
                                      setEditingLinkId(
                                        null
                                      )
                                  }
                                  className="
                                    shrink-0
                                    rounded-full
                                    border
                                    border-black
                                    bg-transparent
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-black
                                  "
                                >
                                  Done
                                </button>

                              </div>

                            </div>

                          )}

                        </div>

                      </div>

                    </div>

                  )

                }
              )}

            </div>

          </section>


          {error && (

            <div
              className="
                mt-6
                rounded-[28px]
                border
                border-black
                px-5
                py-4
                text-center
                text-sm
                font-medium
              "
            >
              {error}
            </div>

          )}


          <div
            className="
              mt-8
              flex
              flex-col
              items-center
              justify-center
              gap-3
              text-center
              sm:flex-row
              sm:flex-wrap
            "
          >

            <button
              type="button"
              onClick={
                () => {

                  setAddingLinks(false)

                  setEditingLinkId(
                    null
                  )

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
                border
                border-black
                bg-transparent
                px-5
                py-3
                text-sm
                font-black
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Back to ranking
            </button>


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
                  border-black
                  bg-transparent
                  px-6
                  py-3.5
                  text-sm
                  font-black
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
                  bg-black
                  px-7
                  py-3.5
                  text-sm
                  font-black
                  text-white
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

        <section
          className="
            rankd-edition
            relative
            mb-8
            overflow-hidden
            rounded-[28px]
            border
            px-6
            pb-10
            pt-10
            text-center
            md:px-12
            md:pb-14
            md:pt-12
          "
          style={{
            backgroundColor:
              theme.paper,
            borderColor:
              "#111111"
          }}
        >

          <EditionChrome
            theme={theme}
          />

          <div
            className="
              relative
              z-10
            "
          >

            <EditionHeader
              theme={theme}
              category={editionCategory}
              bleed="page"
            >

              <p
                className="
                  text-[11px]
                  font-black
                  uppercase
                  tracking-[0.22em]
                "
                style={{
                  color:
                    theme.accent
                }}
              >
                <EditionMark
                  theme={theme}
                >
                  {
                    isRerank
                      ? "RE-RANKD"
                      : "CREATE"
                  }
                </EditionMark>
              </p>

              <h1
                className={`
                  mx-auto
                  mt-5
                  max-w-3xl
                  text-4xl
                  font-black
                  text-balance
                  hyphens-none
                  md:text-6xl
                  ${theme.titleClass}
                `}
              >
                <EditionTitle
                  theme={theme}
                >
                  {
                    isRerank
                      ? "Rank it differently"
                      : "Make your choices"
                  }
                </EditionTitle>
              </h1>

            </EditionHeader>

            <p
              className="
                relative
                z-10
                mx-auto
                -mt-12
                max-w-xl
                text-base
                font-medium
                leading-7
                text-black/50
                sm:text-lg
              "
            >
              {
                isRerank
                  ? "Start with the existing choices. Change the order to make it yours."
                  : "Seven choices. One order. Your opinion."
              }
            </p>

          </div>

        </section>


        {isRerank && (

          <div
            className="
              rankd-edition
              relative
              mb-8
              overflow-hidden
              rounded-[28px]
              border
              px-5
              py-5
              text-center
              sm:px-6
            "
            style={{
              backgroundColor:
                theme.paper,
              borderColor:
                "#111111"
            }}
          >

            <EditionChrome
              theme={theme}
            />

            <div
              className="
                relative
                z-10
              "
            >

              <p
                className="
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-black/45
                "
              >
                You are re-ranking
              </p>

              <p
                className="
                  mt-2
                  text-base
                  font-black
                  leading-tight
                  text-balance
                  hyphens-none
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
            rankd-edition
            relative
            overflow-hidden
            rounded-[28px]
            border
            p-5
            text-center
            sm:p-8
          "
          style={{
            backgroundColor:
              theme.paper,
            borderColor:
              "#111111"
          }}
        >

          <EditionChrome
            theme={theme}
          />

          <div
            className="
              relative
              z-10
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
                className={labelClass}
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
                className={`
                  ${fieldClass}
                  text-center
                  text-2xl
                  font-black
                  sm:py-5
                  sm:text-3xl
                `}
              />

            </div>


            <div>

              <label
                htmlFor="category"
                className={labelClass}
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
                className={`
                  ${fieldClass}
                  appearance-none
                  text-center
                  text-sm
                  font-bold
                `}
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
                className={labelClass}
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
                className={`
                  ${fieldClass}
                  appearance-none
                  text-center
                  text-sm
                  font-bold
                `}
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
                className={labelClass}
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
                placeholder="Why did you make this RANKD? Links in this text will open in a new tab."
                className={`
                  ${fieldClass}
                  resize-none
                  text-center
                  text-sm
                  font-medium
                  leading-6
                `}
              />

            </div>


            <div
              className="
                sm:col-span-2
              "
            >

              <label
                htmlFor="hero-media"
                className={labelClass}
              >
                Hero media (optional)
              </label>

              <input
                id="hero-media"
                type="url"
                value={mediaUrl}
                onChange={
                  event =>
                    setMediaUrl(
                      event.target.value
                    )
                }
                placeholder="YouTube, Spotify, Instagram, Amazon, Maps or any link"
                className={`
                  ${fieldClass}
                  text-center
                  text-sm
                  font-medium
                `}
              />

              {
                mediaUrl.trim() &&
                isHttpUrl(mediaUrl.trim()) && (
                  <EntryEmbeds
                    url={
                      mediaUrl.trim()
                    }
                    name={
                      title.trim() ||
                      "Hero media"
                    }
                  />
                )
              }

            </div>

          </div>

        </section>


        <section
          className="
            rankd-edition
            relative
            mt-8
            overflow-hidden
            rounded-[28px]
            border
            p-5
            text-center
            sm:p-8
          "
          style={{
            backgroundColor:
              theme.paper,
            borderColor:
              "#111111"
          }}
        >

          <EditionChrome
            theme={theme}
          />

          <div
            className="
              relative
              z-10
            "
          >

            <p
              className="
                text-[10px]
                font-black
                uppercase
                tracking-[0.18em]
              "
              style={{
                color:
                  theme.accent
              }}
            >
              The important bit
            </p>

            <h2
              className="
                mt-2
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

            <div
              className="
                mt-6
                overflow-hidden
                rounded-[28px]
                border
                border-black
                p-3
                text-left
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
                accentColor={
                  theme.accent
                }
              />

            </div>

          </div>

        </section>


        {error && (

          <div
            className="
              mt-6
              rounded-[28px]
              border
              border-black
              px-5
              py-4
              text-center
              text-sm
              font-medium
            "
          >
            {error}
          </div>

        )}


        <div
          className="
            rankd-edition
            relative
            mt-8
            overflow-hidden
            rounded-[28px]
            border
            p-6
            text-center
            sm:p-8
          "
          style={{
            backgroundColor:
              theme.paper,
            borderColor:
              "#111111"
          }}
        >

          <EditionChrome
            theme={theme}
          />

          <div
            className="
              relative
              z-10
            "
          >

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

            <button
              type="button"
              onClick={
                handleContinueToLinks
              }
              disabled={
                saving
              }
              className="
                mt-5
                rounded-full
                bg-black
                px-7
                py-3.5
                text-sm
                font-black
                text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
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