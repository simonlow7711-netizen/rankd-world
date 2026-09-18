"use client"

import {
  ChangeEvent,
  PointerEvent,
  useEffect,
  useRef,
  useState
} from "react"

import {
  supabase
} from "@/utils/supabase"

import {
  createSupabaseRanking
} from "@/utils/supabaseRankings"

import {
  Ranking
} from "@/types/ranking"


const ADMIN_USER_IDS = [
  "76911441-8f8f-4a7d-aa90-c5fbed9381c7",
  "ed3d1894-6e8b-441a-b650-cd906ca40287"
]


const RANKING_CATEGORIES: Record<
  number,
  string
> = {
  1: "Lifestyle",
  2: "Food & Drink",
  3: "Lifestyle",
  4: "Lifestyle",
  5: "Travel",
  6: "General",
  7: "Lifestyle"
}


const PHOTO_RANKD_BUCKET =
  "photo-rankd"


type RankdDraft = {
  id: number
  title: string
  description: string
  items: string[]
  x: number
  y: number
}


type PhotoRankdHotspot = {
  rankingId: number
  rankingSupabaseId: string
  x: number
  y: number
}


const createInitialRankings = (): RankdDraft[] => [
  {
    id: 1,
    title: "Holloway's 7 Pubs Worth Knowing",
    description:
      "Seven Holloway pubs with character, history, atmosphere or simply a very good reason to pull up a chair.",
    items: [
      "The Swimmer at the Grafton Arms",
      "Owl & Hitchhiker",
      "The Hercules",
      "The Victoria Tavern",
      "The Lamb",
      "The Horatia",
      "The George"
    ],
    x: 18,
    y: 18
  },
  {
    id: 2,
    title: "The 7 Commandments of a Proper Sunday Roast",
    description:
      "Seven things that turn a Sunday roast from a meal into a proper British institution.",
    items: [
      "Roast potatoes with actual crunch",
      "Gravy that deserves its own spoon",
      "A Yorkshire pudding big enough to matter",
      "Properly cooked meat",
      "Vegetables that haven't been boiled into submission",
      "Something sharp — horseradish, mustard or mint sauce",
      "Enough food to make dessert feel like a bad decision"
    ],
    x: 38,
    y: 18
  },
  {
    id: 3,
    title: "7 Places to Get Your Laughs in Islington",
    description:
      "Seven places around Islington where a good night out can turn into a very good laugh.",
    items: [
      "Angel Comedy @ The Camden Head",
      "The Bill Murray",
      "Good Ship Comedy @ The Swimmer",
      "The Old Queen's Head",
      "The Hope & Anchor",
      "Downstairs at the King's Head",
      "Comedy Freaks — Kings Cross"
    ],
    x: 62,
    y: 18
  },
  {
    id: 4,
    title: "7 Pub Names That Deserve a Story",
    description:
      "Seven pub names that sound like the beginning of a story — and often are.",
    items: [
      "The Blind Beggar",
      "The Owl & Hitchhiker",
      "The World's End",
      "The Flask",
      "The Black Lion",
      "The Elephant & Castle",
      "The Seven Stars"
    ],
    x: 82,
    y: 35
  },
  {
    id: 5,
    title: "7 Pub Signs You'd Know Anywhere",
    description:
      "Seven unmistakable London pub signs, each with a story, a character and a place in the city's visual memory.",
    items: [
      "The Churchill Arms, Kensington",
      "The Prospect of Whitby, Wapping",
      "The Seven Stars, Holborn",
      "The Lamb & Flag, Covent Garden",
      "The Blind Beggar, Whitechapel",
      "The Flask, Highgate",
      "The World's End, Camden"
    ],
    x: 72,
    y: 68
  },
  {
    id: 6,
    title: "The 7 Pub Quiz Questions That Separate the Tables",
    description:
      "Seven questions designed to separate the confident table from the table that has already started arguing.",
    items: [
      "Which two countries share the world's longest international land border? — Canada and the United States",
      "Which European capital was historically known as Christiania from 1624 until 1925? — Oslo",
      "What was the name of the ship on which Charles Darwin made his famous voyage? — HMS Beagle",
      "Which country has the world's oldest continuously operating parliament? — Iceland",
      "Which composer wrote The Marriage of Figaro? — Wolfgang Amadeus Mozart",
      "In heraldry, what colour is represented by “sable”? — Black",
      "Which London Underground station has the greatest number of different lines serving it? — King's Cross St Pancras"
    ],
    x: 42,
    y: 78
  },
  {
    id: 7,
    title: "7 Unwritten Rules of the British Pub",
    description:
      "Seven small rules that keep the British pub working the way it should.",
    items: [
      "Know whose round it is",
      "Don't queue-jump at the bar",
      "Don't loudly announce the quiz answer",
      "Don't occupy a table for six with a single pint",
      "Return your empty glasses to the bar",
      "Buy the bar staff a drink",
      "Treat the pub dog like a VIP"
    ],
    x: 16,
    y: 68
  }
]


export default function PhotoRankdPage() {
  const [authorised, setAuthorised] =
    useState<boolean | null>(null)

  const [imageUrl, setImageUrl] =
    useState<string | null>(null)

  const [imageFile, setImageFile] =
    useState<File | null>(null)

  const [rankings, setRankings] =
    useState<RankdDraft[]>(
      createInitialRankings()
    )

  const [selectedId, setSelectedId] =
    useState<number>(1)

  const [openedId, setOpenedId] =
    useState<number | null>(null)

  const [isPreview, setIsPreview] =
    useState<boolean>(false)

  const [draggingId, setDraggingId] =
    useState<number | null>(null)

  const [savedRankingIds, setSavedRankingIds] =
    useState<Record<number, string>>({})

  const [isSavingRankings, setIsSavingRankings] =
    useState<boolean>(false)

  const [isPublishing, setIsPublishing] =
    useState<boolean>(false)

  const [saveMessage, setSaveMessage] =
    useState<string>("")

  const [saveError, setSaveError] =
    useState<string>("")

  const [publishedPhotoId, setPublishedPhotoId] =
    useState<string | null>(null)

  const [publishedPhotoUrl, setPublishedPhotoUrl] =
    useState<string | null>(null)

  const imageRef =
    useRef<HTMLImageElement | null>(null)

  const fileInputRef =
    useRef<HTMLInputElement | null>(null)


  useEffect(() => {
    let mounted = true

    const checkAdmin =
      async () => {
        const {
          data
        } =
          await supabase.auth.getUser()

        const userId =
          data.user?.id ?? null

        if (!mounted) {
          return
        }

        setAuthorised(
          userId !== null &&
          ADMIN_USER_IDS.includes(
            userId
          )
        )
      }

    checkAdmin()

    return () => {
      mounted = false
    }
  }, [])


  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(
          imageUrl
        )
      }
    }
  }, [imageUrl])


  const selectedRanking =
    rankings.find(
      ranking =>
        ranking.id === selectedId
    ) ?? rankings[0]


  const openedRanking =
    rankings.find(
      ranking =>
        ranking.id === openedId
    ) ?? null


  const allRankingsSaved =
    rankings.every(
      ranking =>
        Boolean(
          savedRankingIds[
            ranking.id
          ]
        )
    )


  const handleFile =
    (
      file: File | null
    ) => {
      if (!file) {
        return
      }

      if (!file.type.startsWith("image/")) {
        return
      }

      if (imageUrl) {
        URL.revokeObjectURL(
          imageUrl
        )
      }

      const nextUrl =
        URL.createObjectURL(
          file
        )

      setImageUrl(
        nextUrl
      )

      setImageFile(
        file
      )

      setOpenedId(
        null
      )

      setPublishedPhotoId(
        null
      )

      setPublishedPhotoUrl(
        null
      )

      setSaveMessage(
        ""
      )

      setSaveError(
        ""
      )
    }


  const handleFileChange =
    (
      event: ChangeEvent<HTMLInputElement>
    ) => {
      handleFile(
        event.target.files?.[0] ?? null
      )

      event.target.value = ""
    }


  const updateRanking =
    (
      id: number,
      changes: Partial<RankdDraft>
    ) => {
      setRankings(
        current =>
          current.map(
            ranking =>
              ranking.id === id
                ? {
                    ...ranking,
                    ...changes
                  }
                : ranking
          )
      )

      setPublishedPhotoId(
        null
      )

      setPublishedPhotoUrl(
        null
      )
    }


  const updateItem =
    (
      id: number,
      itemIndex: number,
      value: string
    ) => {
      setRankings(
        current =>
          current.map(
            ranking => {
              if (
                ranking.id !== id
              ) {
                return ranking
              }

              const items =
                [...ranking.items]

              items[itemIndex] =
                value

              return {
                ...ranking,
                items
              }
            }
          )
      )

      setPublishedPhotoId(
        null
      )

      setPublishedPhotoUrl(
        null
      )
    }


  const startDragging =
    (
      event: PointerEvent<HTMLButtonElement>,
      ranking: RankdDraft
    ) => {
      if (isPreview) {
        return
      }

      event.preventDefault()

      setSelectedId(
        ranking.id
      )

      setDraggingId(
        ranking.id
      )

      setPublishedPhotoId(
        null
      )

      setPublishedPhotoUrl(
        null
      )

      event.currentTarget.setPointerCapture(
        event.pointerId
      )
    }


  const moveDragging =
    (
      event: PointerEvent<HTMLButtonElement>
    ) => {
      if (
        isPreview ||
        draggingId === null ||
        !imageRef.current
      ) {
        return
      }

      const bounds =
        imageRef.current.getBoundingClientRect()

      const x =
        (
          (event.clientX - bounds.left) /
          bounds.width
        ) *
        100

      const y =
        (
          (event.clientY - bounds.top) /
          bounds.height
        ) *
        100

      const clampedX =
        Math.max(
          3,
          Math.min(
            97,
            x
          )
        )

      const clampedY =
        Math.max(
          3,
          Math.min(
            97,
            y
          )
        )

      updateRanking(
        draggingId,
        {
          x: clampedX,
          y: clampedY
        }
      )
    }


  const finishDragging =
    (
      event: PointerEvent<HTMLButtonElement>
    ) => {
      if (
        draggingId === null
      ) {
        return
      }

      try {
        event.currentTarget.releasePointerCapture(
          event.pointerId
        )
      } catch {
        // Pointer capture may already have been released.
      }

      setDraggingId(
        null
      )
    }


  const handleHotspotClick =
    (
      ranking: RankdDraft
    ) => {
      setSelectedId(
        ranking.id
      )

      if (isPreview) {
        setOpenedId(
          ranking.id
        )
      }
    }


  const createRanking =
    async (
      ranking: RankdDraft,
      userId: string
    ): Promise<string | null> => {

      const {
        data: existingRanking,
        error: existingRankingError
      } =
        await supabase
          .from("rankings")
          .select(
            `
              id
            `
          )
          .eq(
            "title",
            ranking.title
          )
          .eq(
            "user_id",
            userId
          )
          .eq(
            "source_type",
            "seed"
          )
          .limit(
            1
          )
          .maybeSingle()


      if (existingRankingError) {
        throw new Error(
          `Could not check existing RANKD "${ranking.title}".`
        )
      }


      if (existingRanking) {
        return existingRanking.id
      }


      const rankingToCreate =
        {
          id: "",
          title:
            ranking.title,
          category:
            RANKING_CATEGORIES[
              ranking.id
            ],
          creator: "",
          creatorId:
            userId,
          description:
            ranking.description,
          items:
            ranking.items.map(
              (
                name,
                index
              ) => ({
                position:
                  index + 1,
                name,
                votes: 0
              })
            ),
          source: "seed",
          parentId: null,
          rootId: null,
          createdAt: undefined,
          views: 0
        } as Ranking


      const savedRanking =
        await createSupabaseRanking(
          rankingToCreate,
          userId
        )


      if (!savedRanking) {
        throw new Error(
          `Could not save RANKD "${ranking.title}".`
        )
      }


      return savedRanking.id
    }


  const saveSevenRankings =
    async (): Promise<Record<number, string>> => {

      if (isSavingRankings) {
        return savedRankingIds
      }


      setIsSavingRankings(
        true
      )

      setSaveMessage(
        ""
      )

      setSaveError(
        ""
      )


      try {
        const {
          data: userData,
          error: userError
        } =
          await supabase.auth.getUser()


        if (userError) {
          throw new Error(
            "Could not verify the current user."
          )
        }


        const userId =
          userData.user?.id ?? null


        if (
          !userId ||
          !ADMIN_USER_IDS.includes(
            userId
          )
        ) {
          throw new Error(
            "You are not authorised to publish these RANKDs."
          )
        }


        const nextSavedIds:
          Record<number, string> =
          {
            ...savedRankingIds
          }


        for (
          const ranking of rankings
        ) {
          const rankingId =
            await createRanking(
              ranking,
              userId
            )


          if (!rankingId) {
            throw new Error(
              `RANKD ${ranking.id} could not be saved.`
            )
          }


          nextSavedIds[
            ranking.id
          ] =
            rankingId

          setSavedRankingIds(
            {
              ...nextSavedIds
            }
          )
        }


        setSaveMessage(
          "All seven RANKDs are now saved in Supabase."
        )

        return nextSavedIds

      } catch (error) {
        console.error(
          "PHOTO RANKD SAVE ERROR",
          error
        )

        setSaveError(
          error instanceof Error
            ? error.message
            : "The seven RANKDs could not be saved."
        )

        throw error

      } finally {
        setIsSavingRankings(
          false
        )
      }
    }


  const publishPhotoRankd =
    async () => {

      if (isPublishing) {
        return
      }


      setIsPublishing(
        true
      )

      setSaveMessage(
        ""
      )

      setSaveError(
        ""
      )


      try {
        if (!imageFile) {
          throw new Error(
            "Upload a photograph before publishing the Photo RANKD."
          )
        }


        const {
          data: userData,
          error: userError
        } =
          await supabase.auth.getUser()


        if (userError) {
          throw new Error(
            "Could not verify the current user."
          )
        }


        const userId =
          userData.user?.id ?? null


        if (
          !userId ||
          !ADMIN_USER_IDS.includes(
            userId
          )
        ) {
          throw new Error(
            "You are not authorised to publish Photo RANKD experiences."
          )
        }


        let rankingIds =
          savedRankingIds


        if (
          !rankings.every(
            ranking =>
              Boolean(
                rankingIds[
                  ranking.id
                ]
              )
          )
        ) {
          rankingIds =
            await saveSevenRankings()
        }


        const allSaved =
          rankings.every(
            ranking =>
              Boolean(
                rankingIds[
                  ranking.id
                ]
              )
          )


        if (!allSaved) {
          throw new Error(
            "All seven RANKDs must be saved before the Photo RANKD can be published."
          )
        }


        setSaveMessage(
          "Uploading the photograph…"
        )


        const safeFileName =
          imageFile.name
            .toLowerCase()
            .replace(
              /[^a-z0-9.-]+/g,
              "-"
            )
            .replace(
              /^-+|-+$/g,
              ""
            )


        const storagePath =
          `experiences/${userId}/${crypto.randomUUID()}-${safeFileName || "photo-rankd-image"}`


        const {
          error: uploadError
        } =
          await supabase
            .storage
            .from(
              PHOTO_RANKD_BUCKET
            )
            .upload(
              storagePath,
              imageFile,
              {
                cacheControl:
                  "31536000",
                contentType:
                  imageFile.type,
                upsert:
                  false
              }
            )


        if (uploadError) {
          console.error(
            "PHOTO RANKD IMAGE UPLOAD ERROR",
            uploadError
          )

          throw new Error(
            `Could not upload the photograph: ${uploadError.message}`
          )
        }


        const {
          data: publicUrlData
        } =
          supabase
            .storage
            .from(
              PHOTO_RANKD_BUCKET
            )
            .getPublicUrl(
              storagePath
            )


        const publicImageUrl =
          publicUrlData.publicUrl


        const orderedRankingIds =
          rankings.map(
            ranking =>
              rankingIds[
                ranking.id
              ]
          )


        const hotspots:
          PhotoRankdHotspot[] =
          rankings.map(
            ranking => ({
              rankingId:
                ranking.id,
              rankingSupabaseId:
                rankingIds[
                  ranking.id
                ],
              x:
                ranking.x,
              y:
                ranking.y
            })
          )


        setSaveMessage(
          "Creating the published Photo RANKD…"
        )


        const {
          data: photoRankd,
          error: photoRankdError
        } =
          await supabase
            .from(
              "photo_rankds"
            )
            .insert(
              {
                title:
                  "The Swimmer at the Grafton Arms",
                description:
                  "Seven RANKDs inspired by a photograph at The Swimmer at the Grafton Arms, Holloway.",
                image_url:
                  publicImageUrl,
                ranking_ids:
                  orderedRankingIds,
                hotspots,
                created_by:
                  userId
              }
            )
            .select(
              "id"
            )
            .single()


        if (photoRankdError) {
          console.error(
            "PHOTO RANKD DATABASE ERROR",
            photoRankdError
          )

          throw new Error(
            `Could not publish the Photo RANKD: ${photoRankdError.message}`
          )
        }


        if (!photoRankd?.id) {
          throw new Error(
            "The Photo RANKD was created but no publication ID was returned."
          )
        }


        const publicExperienceUrl =
          `/photo-rankd/${photoRankd.id}`


        setPublishedPhotoId(
          photoRankd.id
        )

        setPublishedPhotoUrl(
          publicExperienceUrl
        )

        setSaveMessage(
          "Photo RANKD published successfully."
        )

        setIsPreview(
          true
        )

      } catch (error) {
        console.error(
          "PHOTO RANKD PUBLISH ERROR",
          error
        )

        setSaveError(
          error instanceof Error
            ? error.message
            : "The Photo RANKD could not be published."
        )

      } finally {
        setIsPublishing(
          false
        )
      }
    }


  const createRankingHref =
    (
      ranking: RankdDraft
    ) => {

      const rankingId =
        savedRankingIds[
          ranking.id
        ]


      if (rankingId) {
        return `/rank/${rankingId}`
      }


      const params =
        new URLSearchParams()


      params.set(
        "source",
        "photo-rankd"
      )


      params.set(
        "title",
        ranking.title
      )


      params.set(
        "description",
        ranking.description
      )


      params.set(
        "items",
        JSON.stringify(
          ranking.items
        )
      )


      return `/create?${params.toString()}`
    }


  const resetTest =
    () => {

      if (imageUrl) {
        URL.revokeObjectURL(
          imageUrl
        )
      }


      setImageUrl(
        null
      )

      setImageFile(
        null
      )

      setRankings(
        createInitialRankings()
      )

      setSelectedId(
        1
      )

      setOpenedId(
        null
      )

      setIsPreview(
        false
      )

      setDraggingId(
        null
      )

      setSavedRankingIds(
        {}
      )

      setSaveMessage(
        ""
      )

      setSaveError(
        ""
      )

      setPublishedPhotoId(
        null
      )

      setPublishedPhotoUrl(
        null
      )
    }


  if (authorised === null) {
    return (
      <main className="min-h-screen bg-[#F7F4EE] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-black/45">
            RANKD
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-black">
            Photo RANKD
          </h1>

          <p className="mt-4 text-black/55">
            Checking access…
          </p>
        </div>
      </main>
    )
  }


  if (!authorised) {
    return (
      <main className="min-h-screen bg-[#F7F4EE] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-black/45">
            RANKD
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-[-0.05em] text-black">
            Access restricted
          </h1>

          <p className="mt-4 max-w-xl text-black/60">
            This Photo RANKD prototype is currently
            available only to RANKD administrators.
          </p>
        </div>
      </main>
    )
  }


  return (
    <main className="min-h-screen bg-[#F7F4EE] text-black">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">

        <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-5xl font-black leading-none tracking-[-0.16em] text-[#FF6B35]">
                7
              </span>

              <span className="text-3xl font-black tracking-[-0.065em]">
                RANKD
              </span>
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-black/45">
              Admin prototype · Photo RANKD
            </p>

            <h1 className="mt-2 max-w-3xl text-3xl font-black tracking-[-0.05em] md:text-5xl">
              Turn a photograph into seven RANKDs.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60 md:text-base">
              Upload a photograph, place seven RANKD hotspots
              over it, refine the rankings and publish the
              finished experience.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setIsPreview(false)
              }
              className={`
                rounded-full
                px-5
                py-2.5
                text-sm
                font-black
                transition
                ${
                  !isPreview
                    ? "bg-black text-white"
                    : "bg-black/5 text-black/55 hover:bg-black/10"
                }
              `}
            >
              Edit
            </button>

            <button
              type="button"
              onClick={() =>
                setIsPreview(true)
              }
              className={`
                rounded-full
                px-5
                py-2.5
                text-sm
                font-black
                transition
                ${
                  isPreview
                    ? "bg-black text-white"
                    : "bg-black/5 text-black/55 hover:bg-black/10"
                }
              `}
            >
              Preview
            </button>

            <button
              type="button"
              onClick={saveSevenRankings}
              disabled={
                isSavingRankings ||
                isPublishing
              }
              className="
                rounded-full
                bg-black
                px-5
                py-2.5
                text-sm
                font-black
                text-white
                transition
                hover:bg-black/80
                disabled:cursor-wait
                disabled:opacity-60
              "
            >
              {isSavingRankings
                ? "Saving seven RANKDs…"
                : allRankingsSaved
                  ? "Seven RANKDs saved"
                  : "Save seven RANKDs"}
            </button>

            <button
              type="button"
              onClick={publishPhotoRankd}
              disabled={
                isPublishing ||
                isSavingRankings ||
                !imageFile
              }
              className="
                rounded-full
                bg-[#FF6B35]
                px-5
                py-2.5
                text-sm
                font-black
                text-black
                transition
                hover:bg-[#ff7848]
                disabled:cursor-wait
                disabled:opacity-50
              "
            >
              {isPublishing
                ? "Publishing…"
                : publishedPhotoId
                  ? "Photo RANKD published"
                  : "Publish Photo RANKD"}
            </button>

            <button
              type="button"
              onClick={resetTest}
              className="
                rounded-full
                border
                border-black/10
                px-5
                py-2.5
                text-sm
                font-black
                text-black/65
                transition
                hover:border-black/20
                hover:bg-black/5
              "
            >
              Start again
            </button>
          </div>
        </header>


        {(saveMessage ||
          saveError ||
          publishedPhotoUrl) && (
          <div className="mb-6 space-y-3">

            {saveMessage && (
              <div className="rounded-2xl bg-black px-5 py-4 text-sm font-bold text-white">
                {saveMessage}
              </div>
            )}

            {saveError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
                {saveError}
              </div>
            )}

            {publishedPhotoUrl && (
              <div className="rounded-[1.5rem] border border-[#FF6B35]/30 bg-[#FF6B35]/10 p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-black/45">
                  Published
                </p>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-black">
                      The Photo RANKD is now live.
                    </p>

                    <p className="mt-1 text-xs text-black/50">
                      The photograph, seven ranking connections
                      and hotspot positions are now stored in Supabase.
                    </p>
                  </div>

                  <a
                    href={publishedPhotoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      shrink-0
                      rounded-full
                      bg-black
                      px-5
                      py-2.5
                      text-center
                      text-sm
                      font-black
                      text-white
                      transition
                      hover:bg-black/80
                    "
                  >
                    Open published experience →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}


        {!imageUrl ? (
          <section className="rounded-[2rem] border border-black/10 bg-white/50 p-5 md:p-8">
            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="
                flex
                min-h-[420px]
                w-full
                flex-col
                items-center
                justify-center
                rounded-[1.5rem]
                border-2
                border-dashed
                border-black/15
                bg-[#F7F4EE]
                px-6
                text-center
                transition
                hover:border-black/30
                hover:bg-white
              "
            >
              <span className="text-7xl font-black leading-none tracking-[-0.16em] text-[#FF6B35]/40">
                7
              </span>

              <span className="mt-5 text-2xl font-black tracking-[-0.04em]">
                Upload a photo
              </span>

              <span className="mt-2 max-w-md text-sm leading-6 text-black/50">
                Use an iPhone photo or any other image.
                RANKD will turn it into a seven-hotspot
                discovery experience.
              </span>

              <span className="mt-6 rounded-full bg-black px-5 py-2.5 text-sm font-black text-white">
                Choose photo
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </section>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

            <section className="min-w-0">
              <div className="mb-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
                    {isPreview
                      ? "Visitor preview"
                      : "Editor"}
                  </p>

                  <p className="mt-1 text-sm text-black/55">
                    {isPreview
                      ? "Tap a 7 to discover its RANKD."
                      : "Drag the seven 7s to position the hotspots."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="
                    shrink-0
                    rounded-full
                    border
                    border-black/10
                    px-4
                    py-2
                    text-xs
                    font-black
                    text-black/60
                    transition
                    hover:border-black/20
                    hover:bg-black/5
                  "
                >
                  Change photo
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>


              <div className="overflow-hidden rounded-[2rem] bg-black shadow-[0_20px_70px_rgba(0,0,0,0.12)]">
                <div className="relative aspect-[4/3] w-full">

                  <img
                    ref={imageRef}
                    src={imageUrl}
                    alt="Photo RANKD source"
                    className="
                      absolute
                      inset-0
                      h-full
                      w-full
                      object-contain
                    "
                  />


                  <div className="absolute inset-0">
                    {rankings.map(
                      ranking => {
                        const isSelected =
                          ranking.id === selectedId

                        const isDragging =
                          ranking.id === draggingId

                        const isSaved =
                          Boolean(
                            savedRankingIds[
                              ranking.id
                            ]
                          )

                        return (
                          <button
                            key={ranking.id}
                            type="button"
                            aria-label={
                              isPreview
                                ? `Open RANKD ${ranking.id}: ${ranking.title}`
                                : `Select and move RANKD ${ranking.id}: ${ranking.title}`
                            }
                            onPointerDown={
                              event =>
                                startDragging(
                                  event,
                                  ranking
                                )
                            }
                            onPointerMove={
                              moveDragging
                            }
                            onPointerUp={
                              finishDragging
                            }
                            onPointerCancel={
                              finishDragging
                            }
                            onClick={() =>
                              handleHotspotClick(
                                ranking
                              )
                            }
                            className={`
                              group
                              absolute
                              z-10
                              -translate-x-1/2
                              -translate-y-1/2
                              select-none
                              ${
                                isPreview
                                  ? "cursor-pointer"
                                  : "cursor-grab"
                              }
                              ${
                                isDragging
                                  ? "cursor-grabbing"
                                  : ""
                              }
                              ${
                                isDragging
                                  ? "scale-110"
                                  : ""
                              }
                              transition
                              duration-150
                              ${
                                isSelected &&
                                !isPreview
                                  ? "scale-[1.04]"
                                  : ""
                              }
                            `}
                            style={{
                              left: `${ranking.x}%`,
                              top: `${ranking.y}%`,
                              touchAction:
                                isPreview
                                  ? "auto"
                                  : "none"
                            }}
                          >
                            <span
                              className="
                                absolute
                                -right-1
                                -top-1
                                z-20
                                min-w-5
                                rounded-md
                                bg-[#F7F4EE]/90
                                px-1.5
                                py-1
                                text-[10px]
                                font-black
                                leading-none
                                text-black
                                shadow-sm
                                backdrop-blur-sm
                                transition
                                group-hover:bg-black
                                group-hover:text-white
                              "
                            >
                              {ranking.id}
                            </span>

                            <span
                              className={`
                                pointer-events-none
                                block
                                text-[5rem]
                                font-black
                                leading-none
                                tracking-[-0.16em]
                                transition
                                md:text-[5.5rem]
                                ${
                                  isDragging
                                    ? "text-[#FF6B35]/[0.98]"
                                    : isSelected &&
                                      !isPreview
                                      ? "text-[#FF6B35]/[0.55]"
                                      : "text-[#FF6B35]/[0.28]"
                                }
                                group-hover:text-[#FF6B35]/[0.95]
                              `}
                            >
                              7
                            </span>

                            {isSaved && (
                              <span className="pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/75 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-white">
                                saved
                              </span>
                            )}
                          </button>
                        )
                      }
                    )}
                  </div>


                  {isPreview &&
                    openedRanking && (
                      <div className="absolute inset-x-3 bottom-3 z-30 md:hidden">
                        <div className="rounded-[1.5rem] bg-[#F7F4EE]/95 p-5 shadow-2xl backdrop-blur-md">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40">
                                RANKD {openedRanking.id} of 7
                              </p>

                              <h2 className="mt-2 text-xl font-black leading-tight tracking-[-0.04em]">
                                {openedRanking.title}
                              </h2>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                setOpenedId(null)
                              }
                              className="shrink-0 text-xl font-black text-black/35 hover:text-black"
                              aria-label="Close ranking"
                            >
                              ×
                            </button>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-black/60">
                            {openedRanking.description}
                          </p>

                          <ol className="mt-4 space-y-2">
                            {openedRanking.items.map(
                              (item, index) => (
                                <li
                                  key={`${openedRanking.id}-${index}`}
                                  className="flex gap-3 text-sm"
                                >
                                  <span className="w-4 shrink-0 font-black text-black/35">
                                    {index + 1}
                                  </span>

                                  <span className="font-medium leading-5">
                                    {item}
                                  </span>
                                </li>
                              )
                            )}
                          </ol>

                          <a
                            href={createRankingHref(
                              openedRanking
                            )}
                            className="
                              mt-5
                              block
                              rounded-full
                              bg-black
                              px-5
                              py-3
                              text-center
                              text-sm
                              font-black
                              text-white
                              transition
                              hover:bg-black/80
                            "
                          >
                            {savedRankingIds[
                              openedRanking.id
                            ]
                              ? "Open RANKD →"
                              : "Create your RANKD version →"}
                          </a>
                        </div>
                      </div>
                    )}
                </div>
              </div>


              {isPreview && (
                <div className="mt-4 rounded-[1.5rem] border border-black/10 bg-white/50 p-4 md:p-5">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-black leading-none tracking-[-0.16em] text-[#FF6B35]/40">
                      7
                    </span>

                    <div>
                      <p className="text-sm font-black">
                        Discover seven RANKDs inside one photograph.
                      </p>

                      <p className="mt-1 text-xs leading-5 text-black/50">
                        Tap a numbered 7 to open the ranking.
                        The hotspots are fixed in the published
                        experience.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>


            <aside className="min-w-0">

              {!isPreview ? (
                <div className="rounded-[2rem] border border-black/10 bg-white/60 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
                        RANKD {selectedRanking.id} of 7
                      </p>

                      <h2 className="mt-2 text-2xl font-black leading-tight tracking-[-0.04em]">
                        {selectedRanking.title}
                      </h2>
                    </div>

                    <span className="text-5xl font-black leading-none tracking-[-0.16em] text-[#FF6B35]/30">
                      7
                    </span>
                  </div>


                  <label className="mt-6 block">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-black/40">
                      Title
                    </span>

                    <input
                      value={selectedRanking.title}
                      onChange={event =>
                        updateRanking(
                          selectedRanking.id,
                          {
                            title:
                              event.target.value
                          }
                        )
                      }
                      className="
                        mt-2
                        w-full
                        rounded-2xl
                        border
                        border-black/10
                        bg-[#F7F4EE]
                        px-4
                        py-3
                        text-sm
                        font-bold
                        outline-none
                        transition
                        focus:border-black/30
                      "
                    />
                  </label>


                  <label className="mt-5 block">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-black/40">
                      Description
                    </span>

                    <textarea
                      value={selectedRanking.description}
                      onChange={event =>
                        updateRanking(
                          selectedRanking.id,
                          {
                            description:
                              event.target.value
                          }
                        )
                      }
                      rows={4}
                      className="
                        mt-2
                        w-full
                        resize-none
                        rounded-2xl
                        border
                        border-black/10
                        bg-[#F7F4EE]
                        px-4
                        py-3
                        text-sm
                        leading-6
                        outline-none
                        transition
                        focus:border-black/30
                      "
                    />
                  </label>


                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-[0.14em] text-black/40">
                        Seven items
                      </span>

                      <span className="text-xs font-bold text-black/35">
                        Drag 7 on photo
                      </span>
                    </div>

                    <div className="mt-2 space-y-2">
                      {selectedRanking.items.map(
                        (item, index) => (
                          <div
                            key={`${selectedRanking.id}-${index}`}
                            className="flex gap-2"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 text-xs font-black text-black/45">
                              {index + 1}
                            </div>

                            <input
                              value={item}
                              onChange={event =>
                                updateItem(
                                  selectedRanking.id,
                                  index,
                                  event.target.value
                                )
                              }
                              className="
                                min-w-0
                                flex-1
                                rounded-xl
                                border
                                border-black/10
                                bg-[#F7F4EE]
                                px-3
                                py-2
                                text-sm
                                outline-none
                                transition
                                focus:border-black/30
                              "
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>


                  <div className="mt-5 rounded-2xl bg-black/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">
                          Category
                        </p>

                        <p className="mt-1 text-sm font-black">
                          {RANKING_CATEGORIES[
                            selectedRanking.id
                          ]}
                        </p>
                      </div>

                      <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-black/45">
                        {savedRankingIds[
                          selectedRanking.id
                        ]
                          ? "Saved"
                          : "Not saved"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-[2rem] border border-black/10 bg-white/60 p-5">

                  {!openedRanking ? (
                    <>
                      <div className="flex items-center gap-3">
                        <span className="text-5xl font-black leading-none tracking-[-0.16em] text-[#FF6B35]/30">
                          7
                        </span>

                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
                            Photo RANKD
                          </p>

                          <h2 className="mt-1 text-xl font-black tracking-[-0.04em]">
                            Choose a hotspot
                          </h2>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-6 text-black/55">
                        The photograph is the discovery layer.
                        Each numbered 7 opens a complete RANKD.
                      </p>

                      <div className="mt-5 space-y-2">
                        {rankings.map(
                          ranking => (
                            <button
                              key={ranking.id}
                              type="button"
                              onClick={() =>
                                setOpenedId(
                                  ranking.id
                                )
                              }
                              className="
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                border-black/10
                                bg-[#F7F4EE]
                                px-3
                                py-3
                                text-left
                                transition
                                hover:border-black/20
                                hover:bg-white
                              "
                            >
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-black text-xs font-black text-white">
                                {ranking.id}
                              </span>

                              <span className="min-w-0 flex-1 text-sm font-black leading-5">
                                {ranking.title}
                              </span>

                              <span className="text-black/30">
                                →
                              </span>
                            </button>
                          )
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setOpenedId(null)
                        }
                        className="text-xs font-black uppercase tracking-[0.14em] text-black/40 transition hover:text-black"
                      >
                        ← All seven RANKDs
                      </button>

                      <div className="mt-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
                              RANKD {openedRanking.id} of 7
                            </p>

                            <h2 className="mt-2 text-2xl font-black leading-tight tracking-[-0.04em]">
                              {openedRanking.title}
                            </h2>
                          </div>

                          <span className="text-5xl font-black leading-none tracking-[-0.16em] text-[#FF6B35]/30">
                            7
                          </span>
                        </div>

                        <p className="mt-4 text-sm leading-6 text-black/60">
                          {openedRanking.description}
                        </p>

                        <ol className="mt-5 space-y-3">
                          {openedRanking.items.map(
                            (item, index) => (
                              <li
                                key={`${openedRanking.id}-${index}`}
                                className="flex gap-3"
                              >
                                <span className="w-5 shrink-0 text-sm font-black text-black/35">
                                  {index + 1}
                                </span>

                                <span className="text-sm font-medium leading-5">
                                  {item}
                                </span>
                              </li>
                            )
                          )}
                        </ol>

                        <a
                          href={createRankingHref(
                            openedRanking
                          )}
                          className="
                            mt-6
                            block
                            rounded-full
                            bg-black
                            px-5
                            py-3.5
                            text-center
                            text-sm
                            font-black
                            text-white
                            transition
                            hover:bg-black/80
                          "
                        >
                          {savedRankingIds[
                            openedRanking.id
                          ]
                            ? "Open RANKD →"
                            : "Create your RANKD version →"}
                        </a>

                        <p className="mt-3 text-center text-[11px] leading-5 text-black/40">
                          {savedRankingIds[
                            openedRanking.id
                          ]
                            ? "This is now a real RANKD and uses the normal RANK / RE-RANK experience."
                            : "Save the seven RANKDs above to make this a real RANKD."}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}


              {!isPreview && (
                <div className="mt-4 rounded-[1.5rem] bg-black p-5 text-white">
                  <div className="flex items-start gap-3">
                    <span className="text-4xl font-black leading-none tracking-[-0.16em] text-[#FF6B35]">
                      7
                    </span>

                    <div>
                      <p className="text-sm font-black">
                        Ready to publish
                      </p>

                      <p className="mt-1 text-xs leading-5 text-white/55">
                        Save the seven RANKDs, position the
                        hotspots and publish the photograph.
                        The finished experience will receive
                        its own permanent URL.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={publishPhotoRankd}
                    disabled={
                      isPublishing ||
                      isSavingRankings ||
                      !imageFile
                    }
                    className="
                      mt-5
                      w-full
                      rounded-full
                      bg-[#FF6B35]
                      px-5
                      py-3
                      text-sm
                      font-black
                      text-black
                      transition
                      hover:bg-[#ff7848]
                      disabled:cursor-wait
                      disabled:opacity-50
                    "
                  >
                    {isPublishing
                      ? "Publishing…"
                      : "Publish Photo RANKD →"}
                  </button>
                </div>
              )}

            </aside>
          </div>
        )}

      </div>
    </main>
  )
}