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
  1: "Travel",
  2: "Travel",
  3: "Food & Drink",
  4: "Travel",
  5: "Travel",
  6: "Travel",
  7: "Travel"
}


const PHOTO_RANKD_BUCKET =
  "photo-rankd"


type RankdDraft = {
  id: number
  title: string
  description: string
  items: string[]
  itemLinks: string[]
  x: number
  y: number
}


type PhotoRankdHotspot = {
  rankingId: number
  rankingSupabaseId: string
  x: number
  y: number
}


type PhotoProject = {
  id: string
  imageUrl: string
  imageFile: File
  rankings: RankdDraft[]
  savedRankingIds: Record<number, string>
  publishedPhotoId: string | null
  publishedPhotoUrl: string | null
  isSaving: boolean
  isPublishing: boolean
  saveMessage: string
  saveError: string
}


const emptyItems =
  (): string[] => [
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ]


const emptyItemLinks =
  (): string[] => [
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ]


const createInitialRankings =
  (): RankdDraft[] => [
    {
      id: 1,
      title:
        "Top 7 Useful Croatian Phrases",
      description:
        "Seven useful Croatian phrases to know before exploring Dubrovnik.",
      items:
        emptyItems(),
      itemLinks:
        emptyItemLinks(),
      x: 18,
      y: 18
    },
    {
      id: 2,
      title:
        "Top 7 Historical Facts About Dubrovnik",
      description:
        "Seven facts that bring Dubrovnik's extraordinary history into focus.",
      items:
        emptyItems(),
      itemLinks:
        emptyItemLinks(),
      x: 38,
      y: 18
    },
    {
      id: 3,
      title:
        "Top 7 Restaurants in Dubrovnik",
      description:
        "Seven Dubrovnik restaurants worth knowing about.",
      items:
        emptyItems(),
      itemLinks:
        emptyItemLinks(),
      x: 62,
      y: 18
    },
    {
      id: 4,
      title:
        "Top 7 Dubrovnik Views You Won't Forget",
      description:
        "Seven views that capture Dubrovnik from its most memorable angles.",
      items:
        emptyItems(),
      itemLinks:
        emptyItemLinks(),
      x: 82,
      y: 35
    },
    {
      id: 5,
      title:
        "Top 7 Day Trips from Dubrovnik",
      description:
        "Seven places worth considering when you want to explore beyond Dubrovnik.",
      items:
        emptyItems(),
      itemLinks:
        emptyItemLinks(),
      x: 72,
      y: 68
    },
    {
      id: 6,
      title:
        "Top 7 Dubrovnik Film & TV Locations",
      description:
        "Seven locations around Dubrovnik that have appeared on screen.",
      items:
        emptyItems(),
      itemLinks:
        emptyItemLinks(),
      x: 42,
      y: 78
    },
    {
      id: 7,
      title:
        "Top 7 Dubrovnik Beaches & Swimming Spots",
      description:
        "Seven places for swimming, sea views and a proper Dubrovnik dip.",
      items:
        emptyItems(),
      itemLinks:
        emptyItemLinks(),
      x: 16,
      y: 68
    }
  ]


const createProject =
  (
    file: File
  ): PhotoProject => {

    return {
      id:
        crypto.randomUUID(),
      imageUrl:
        URL.createObjectURL(
          file
        ),
      imageFile:
        file,
      rankings:
        createInitialRankings(),
      savedRankingIds:
        {},
      publishedPhotoId:
        null,
      publishedPhotoUrl:
        null,
      isSaving:
        false,
      isPublishing:
        false,
      saveMessage:
        "",
      saveError:
        ""
    }
  }


export default function PhotoRankdPage() {

  const [
    authorised,
    setAuthorised
  ] =
    useState<boolean | null>(
      null
    )


  const [
    projects,
    setProjects
  ] =
    useState<PhotoProject[]>(
      []
    )


  const [
    selectedProjectId,
    setSelectedProjectId
  ] =
    useState<string | null>(
      null
    )


  const [
    selectedRankingId,
    setSelectedRankingId
  ] =
    useState<number>(
      1
    )


  const [
    openedId,
    setOpenedId
  ] =
    useState<number | null>(
      null
    )


  const [
    isPreview,
    setIsPreview
  ] =
    useState<boolean>(
      false
    )


  const [
    draggingId,
    setDraggingId
  ] =
    useState<number | null>(
      null
    )


  const imageRef =
    useRef<HTMLImageElement | null>(
      null
    )


  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    )


  const selectedProject =
    projects.find(
      project =>
        project.id ===
        selectedProjectId
    ) ?? null


  const selectedRanking =
    selectedProject?.rankings.find(
      ranking =>
        ranking.id ===
        selectedRankingId
    ) ??
    selectedProject?.rankings[0] ??
    null


  const openedRanking =
    selectedProject?.rankings.find(
      ranking =>
        ranking.id ===
        openedId
    ) ??
    null


  const publishedCount =
    projects.filter(
      project =>
        Boolean(
          project.publishedPhotoId
        )
    ).length


  useEffect(
    () => {

      let mounted =
        true


      const checkAdmin =
        async () => {

          const {
            data
          } =
            await supabase.auth.getUser()


          const userId =
            data.user?.id ??
            null


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
        mounted =
          false
      }

    },
    []
  )


  useEffect(
    () => {

      return () => {

        projects.forEach(
          project => {

            URL.revokeObjectURL(
              project.imageUrl
            )

          }
        )

      }

    },
    []
  )


  const updateProject =
    (
      projectId: string,
      changes: Partial<PhotoProject>
    ) => {

      setProjects(
        current =>
          current.map(
            project =>
              project.id ===
              projectId
                ? {
                    ...project,
                    ...changes
                  }
                : project
          )
      )

    }


  const addFiles =
    (
      files: File[]
    ) => {

      const imageFiles =
        files.filter(
          file =>
            file.type.startsWith(
              "image/"
            )
        )


      if (
        imageFiles.length === 0
      ) {
        return
      }


      const newProjects =
        imageFiles.map(
          file =>
            createProject(
              file
            )
        )


      setProjects(
        current => [
          ...current,
          ...newProjects
        ]
      )


      if (
        !selectedProjectId &&
        newProjects[0]
      ) {

        setSelectedProjectId(
          newProjects[0].id
        )

      }


      setSelectedRankingId(
        1
      )

      setOpenedId(
        null
      )

      setIsPreview(
        false
      )

    }


  const handleFileChange =
    (
      event:
        ChangeEvent<HTMLInputElement>
    ) => {

      const files =
        Array.from(
          event.target.files ??
          []
        )


      addFiles(
        files
      )


      event.target.value =
        ""

    }


  const removeProject =
    (
      projectId: string
    ) => {

      const project =
        projects.find(
          item =>
            item.id ===
            projectId
        )


      if (!project) {
        return
      }


      URL.revokeObjectURL(
        project.imageUrl
      )


      const remaining =
        projects.filter(
          item =>
            item.id !==
            projectId
        )


      setProjects(
        remaining
      )


      if (
        selectedProjectId ===
        projectId
      ) {

        const nextProject =
          remaining[0] ??
          null


        setSelectedProjectId(
          nextProject?.id ??
          null
        )

        setSelectedRankingId(
          1
        )

        setOpenedId(
          null
        )

        setIsPreview(
          false
        )

      }

    }


  const selectProject =
    (
      projectId: string
    ) => {

      setSelectedProjectId(
        projectId
      )

      setSelectedRankingId(
        1
      )

      setOpenedId(
        null
      )

      setDraggingId(
        null
      )

      setIsPreview(
        false
      )

    }


  const updateRanking =
    (
      projectId: string,
      rankingId: number,
      changes: Partial<RankdDraft>
    ) => {

      setProjects(
        current =>
          current.map(
            project => {

              if (
                project.id !==
                projectId
              ) {
                return project
              }


              return {
                ...project,
                rankings:
                  project.rankings.map(
                    ranking =>
                      ranking.id ===
                      rankingId
                        ? {
                            ...ranking,
                            ...changes
                          }
                        : ranking
                  ),
                publishedPhotoId:
                  null,
                publishedPhotoUrl:
                  null,
                saveMessage:
                  "",
                saveError:
                  ""
              }

            }
          )
      )

    }


  const updateItem =
    (
      projectId: string,
      rankingId: number,
      itemIndex: number,
      value: string
    ) => {

      setProjects(
        current =>
          current.map(
            project => {

              if (
                project.id !==
                projectId
              ) {
                return project
              }


              return {
                ...project,
                rankings:
                  project.rankings.map(
                    ranking => {

                      if (
                        ranking.id !==
                        rankingId
                      ) {
                        return ranking
                      }


                      const items =
                        [
                          ...ranking.items
                        ]


                      items[
                        itemIndex
                      ] =
                        value


                      return {
                        ...ranking,
                        items
                      }

                    }
                  ),
                publishedPhotoId:
                  null,
                publishedPhotoUrl:
                  null,
                saveMessage:
                  "",
                saveError:
                  ""
              }

            }
          )
      )

    }


  const updateItemLink =
    (
      projectId: string,
      rankingId: number,
      itemIndex: number,
      value: string
    ) => {

      setProjects(
        current =>
          current.map(
            project => {

              if (
                project.id !==
                projectId
              ) {
                return project
              }


              return {
                ...project,
                rankings:
                  project.rankings.map(
                    ranking => {

                      if (
                        ranking.id !==
                        rankingId
                      ) {
                        return ranking
                      }


                      const itemLinks =
                        [
                          ...ranking.itemLinks
                        ]


                      itemLinks[
                        itemIndex
                      ] =
                        value


                      return {
                        ...ranking,
                        itemLinks
                      }

                    }
                  ),
                publishedPhotoId:
                  null,
                publishedPhotoUrl:
                  null,
                saveMessage:
                  "",
                saveError:
                  ""
              }

            }
          )
      )

    }


  const startDragging =
    (
      event:
        PointerEvent<HTMLButtonElement>,
      ranking:
        RankdDraft
    ) => {

      if (
        isPreview ||
        !selectedProject
      ) {
        return
      }


      event.preventDefault()


      setSelectedRankingId(
        ranking.id
      )


      setDraggingId(
        ranking.id
      )


      updateRanking(
        selectedProject.id,
        ranking.id,
        {}
      )


      event.currentTarget.setPointerCapture(
        event.pointerId
      )

    }


  const moveDragging =
    (
      event:
        PointerEvent<HTMLButtonElement>
    ) => {

      if (
        isPreview ||
        draggingId === null ||
        !imageRef.current ||
        !selectedProject
      ) {
        return
      }


      const bounds =
        imageRef.current.getBoundingClientRect()


      const x =
        (
          (
            event.clientX -
            bounds.left
          ) /
          bounds.width
        ) *
        100


      const y =
        (
          (
            event.clientY -
            bounds.top
          ) /
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
        selectedProject.id,
        draggingId,
        {
          x:
            clampedX,
          y:
            clampedY
        }
      )

    }


  const finishDragging =
    (
      event:
        PointerEvent<HTMLButtonElement>
    ) => {

      if (
        draggingId ===
        null
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
      ranking:
        RankdDraft
    ) => {

      setSelectedRankingId(
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
      ranking:
        RankdDraft,
      userId:
        string
    ): Promise<string | null> => {

      const {
        data:
          existingRanking,
        error:
          existingRankingError
      } =
        await supabase
          .from(
            "rankings"
          )
          .select(
            "id"
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


      if (
        existingRankingError
      ) {

        throw new Error(
          `Could not check existing RANKD "${ranking.title}".`
        )

      }


      if (
        existingRanking
      ) {

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
                votes:
                  0,
                externalUrl:
                  ranking.itemLinks[
                    index
                  ]?.trim() ||
                  undefined
              })
            ),
          source:
            "seed",
          parentId:
            null,
          rootId:
            null,
          createdAt:
            undefined,
          views:
            0
        } as Ranking


      const savedRanking =
        await createSupabaseRanking(
          rankingToCreate,
          userId
        )


      if (
        !savedRanking
      ) {

        throw new Error(
          `Could not save RANKD "${ranking.title}".`
        )

      }


      return savedRanking.id

    }


  const saveSevenRankings =
    async (
      projectId:
        string
    ): Promise<
      Record<number, string>
    > => {

      const project =
        projects.find(
          item =>
            item.id ===
            projectId
        )


      if (!project) {

        throw new Error(
          "Photo project not found."
        )

      }


      if (
        project.isSaving
      ) {

        return project.savedRankingIds

      }


      updateProject(
        projectId,
        {
          isSaving:
            true,
          saveMessage:
            "",
          saveError:
            ""
        }
      )


      try {

        const {
          data:
            userData,
          error:
            userError
        } =
          await supabase.auth.getUser()


        if (
          userError
        ) {

          throw new Error(
            "Could not verify the current user."
          )

        }


        const userId =
          userData.user?.id ??
          null


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
            ...project.savedRankingIds
          }


        for (
          const ranking of
          project.rankings
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


          updateProject(
            projectId,
            {
              savedRankingIds:
                {
                  ...nextSavedIds
                }
            }
          )

        }


        updateProject(
          projectId,
          {
            savedRankingIds:
              nextSavedIds,
            saveMessage:
              "All seven RANKDs are now saved in Supabase.",
            saveError:
              ""
          }
        )


        return nextSavedIds

      } catch (
        error
      ) {

        console.error(
          "PHOTO RANKD SAVE ERROR",
          error
        )


        updateProject(
          projectId,
          {
            saveError:
              error instanceof Error
                ? error.message
                : "The seven RANKDs could not be saved."
          }
        )


        throw error

      } finally {

        updateProject(
          projectId,
          {
            isSaving:
              false
          }
        )

      }

    }


  const publishPhotoRankd =
    async (
      projectId:
        string
    ) => {

      const project =
        projects.find(
          item =>
            item.id ===
            projectId
        )


      if (
        !project ||
        project.isPublishing
      ) {

        return

      }


      updateProject(
        projectId,
        {
          isPublishing:
            true,
          saveMessage:
            "",
          saveError:
            ""
        }
      )


      try {

        const {
          data:
            userData,
          error:
            userError
        } =
          await supabase.auth.getUser()


        if (
          userError
        ) {

          throw new Error(
            "Could not verify the current user."
          )

        }


        const userId =
          userData.user?.id ??
          null


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
          project.savedRankingIds


        if (
          !project.rankings.every(
            ranking =>
              Boolean(
                rankingIds[
                  ranking.id
                ]
              )
          )
        ) {

          rankingIds =
            await saveSevenRankings(
              projectId
            )

        }


        const allSaved =
          project.rankings.every(
            ranking =>
              Boolean(
                rankingIds[
                  ranking.id
                ]
              )
          )


        if (
          !allSaved
        ) {

          throw new Error(
            "All seven RANKDs must be saved before the Photo RANKD can be published."
          )

        }


        updateProject(
          projectId,
          {
            saveMessage:
              "Uploading the photograph…"
          }
        )


        const safeFileName =
          project.imageFile.name
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
          error:
            uploadError
        } =
          await supabase
            .storage
            .from(
              PHOTO_RANKD_BUCKET
            )
            .upload(
              storagePath,
              project.imageFile,
              {
                cacheControl:
                  "31536000",
                contentType:
                  project.imageFile.type,
                upsert:
                  false
              }
            )


        if (
          uploadError
        ) {

          console.error(
            "PHOTO RANKD IMAGE UPLOAD ERROR",
            uploadError
          )


          throw new Error(
            `Could not upload the photograph: ${uploadError.message}`
          )

        }


        const {
          data:
            publicUrlData
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
          project.rankings.map(
            ranking =>
              rankingIds[
                ranking.id
              ]
          )


        const hotspots:
          PhotoRankdHotspot[] =
          project.rankings.map(
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


        updateProject(
          projectId,
          {
            saveMessage:
              "Creating the published Photo RANKD…"
          }
        )


        const {
          data:
            photoRankd,
          error:
            photoRankdError
        } =
          await supabase
            .from(
              "photo_rankds"
            )
            .insert(
              {
                title:
                  project.imageFile.name
                    .replace(
                      /\.[^/.]+$/,
                      ""
                    ),
                description:
                  "Seven RANKDs inspired by this photograph.",
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


        if (
          photoRankdError
        ) {

          console.error(
            "PHOTO RANKD DATABASE ERROR",
            photoRankdError
          )


          throw new Error(
            `Could not publish the Photo RANKD: ${photoRankdError.message}`
          )

        }


        if (
          !photoRankd?.id
        ) {

          throw new Error(
            "The Photo RANKD was created but no publication ID was returned."
          )

        }


        const publicExperienceUrl =
          `/photo-rankd/${photoRankd.id}`


        updateProject(
          projectId,
          {
            publishedPhotoId:
              photoRankd.id,
            publishedPhotoUrl:
              publicExperienceUrl,
            saveMessage:
              "Photo RANKD published successfully.",
            saveError:
              ""
          }
        )

        setIsPreview(
          true
        )

      } catch (
        error
      ) {

        console.error(
          "PHOTO RANKD PUBLISH ERROR",
          error
        )


        updateProject(
          projectId,
          {
            saveError:
              error instanceof Error
                ? error.message
                : "The Photo RANKD could not be published."
          }
        )

      } finally {

        updateProject(
          projectId,
          {
            isPublishing:
              false
          }
        )

      }

    }


  const resetSession =
    () => {

      projects.forEach(
        project => {

          URL.revokeObjectURL(
            project.imageUrl
          )

        }
      )


      setProjects(
        []
      )

      setSelectedProjectId(
        null
      )

      setSelectedRankingId(
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

    }


  if (
    authorised === null
  ) {

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


  if (
    !authorised
  ) {

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

      <div className="mx-auto max-w-[1500px] px-4 py-6 md:px-8 md:py-10">

        <header className="mb-8 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">

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
              Admin · Photo RANKD production
            </p>


            <h1 className="mt-2 max-w-3xl text-3xl font-black tracking-[-0.05em] md:text-5xl">
              Turn photographs into RANKDs.
            </h1>


            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/60 md:text-base">
              Upload multiple photographs, give each one seven
              RANKDs, position the hotspots and publish the
              finished experiences.
            </p>

          </div>


          <div className="flex flex-wrap gap-2">

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
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
              "
            >
              + Add photos
            </button>


            <button
              type="button"
              onClick={() =>
                setIsPreview(
                  false
                )
              }
              disabled={
                !selectedProject
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
                setIsPreview(
                  true
                )
              }
              disabled={
                !selectedProject
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
              onClick={() =>
                selectedProject &&
                saveSevenRankings(
                  selectedProject.id
                )
              }
              disabled={
                !selectedProject ||
                selectedProject.isSaving ||
                selectedProject.isPublishing
              }
              className="
                rounded-full
                border
                border-black/10
                px-5
                py-2.5
                text-sm
                font-black
                text-black
                transition
                hover:border-black/20
                hover:bg-black/5
                disabled:cursor-wait
                disabled:opacity-50
              "
            >
              {selectedProject?.isSaving
                ? "Saving seven…"
                : selectedProject &&
                    Object.keys(
                      selectedProject.savedRankingIds
                    ).length === 7
                  ? "Seven RANKDs saved"
                  : "Save seven RANKDs"}
            </button>


            <button
              type="button"
              onClick={() =>
                selectedProject &&
                publishPhotoRankd(
                  selectedProject.id
                )
              }
              disabled={
                !selectedProject ||
                selectedProject.isPublishing ||
                selectedProject.isSaving
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
              {selectedProject?.isPublishing
                ? "Publishing…"
                : selectedProject?.publishedPhotoId
                  ? "Published"
                  : "Publish Photo RANKD"}
            </button>


            <button
              type="button"
              onClick={resetSession}
              disabled={
                projects.length === 0
              }
              className="
                rounded-full
                border
                border-black/10
                px-5
                py-2.5
                text-sm
                font-black
                text-black/60
                transition
                hover:border-black/20
                hover:bg-black/5
                disabled:opacity-40
              "
            >
              Clear session
            </button>

          </div>

        </header>


        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={
            handleFileChange
          }
          className="hidden"
        />


        {projects.length > 0 && (

          <section className="mb-8 rounded-[2rem] border border-black/10 bg-white/60 p-4 md:p-5">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.18em] text-black/40">
                  Production queue
                </p>


                <p className="mt-1 text-sm font-black">
                  {projects.length} photograph
                  {projects.length === 1
                    ? ""
                    : "s"} · {projects.length * 7} RANKDs
                  planned
                </p>

              </div>


              <div className="text-xs font-bold text-black/45">
                {publishedCount} of{" "}
                {projects.length} Photo RANKD
                {projects.length === 1
                  ? ""
                  : "s"} published
              </div>

            </div>


            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">

              {projects.map(
                (
                  project,
                  index
                ) => {

                  const isSelected =
                    project.id ===
                    selectedProjectId


                  return (

                    <div
                      key={
                        project.id
                      }
                      className={`
                        overflow-hidden
                        rounded-2xl
                        border
                        transition
                        ${
                          isSelected
                            ? "border-black shadow-md"
                            : "border-black/10"
                        }
                      `}
                    >

                      <button
                        type="button"
                        onClick={() =>
                          selectProject(
                            project.id
                          )
                        }
                        className="
                          block
                          w-full
                          text-left
                        "
                      >

                        <div className="relative aspect-[4/3] bg-black">

                          <img
                            src={
                              project.imageUrl
                            }
                            alt={
                              `Photo ${index + 1}`
                            }
                            className="
                              h-full
                              w-full
                              object-cover
                            "
                          />


                          <span className="
                            absolute
                            left-2
                            top-2
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-full
                            bg-black
                            text-xs
                            font-black
                            text-white
                          ">
                            {index + 1}
                          </span>


                          {project.publishedPhotoId && (
                            <span className="
                              absolute
                              bottom-2
                              left-2
                              rounded-full
                              bg-[#FF6B35]
                              px-2
                              py-1
                              text-[9px]
                              font-black
                              uppercase
                              tracking-[0.12em]
                            ">
                              Live
                            </span>
                          )}

                        </div>


                        <div className="p-3">

                          <p className="truncate text-xs font-black">
                            {project.imageFile.name}
                          </p>


                          <p className="mt-1 text-[11px] text-black/45">
                            7 RANKDs
                            {project.publishedPhotoId
                              ? " · Published"
                              : ""}
                          </p>

                        </div>

                      </button>


                      <div className="border-t border-black/5 px-3 py-2">

                        <button
                          type="button"
                          onClick={() =>
                            removeProject(
                              project.id
                            )
                          }
                          className="
                            text-[10px]
                            font-black
                            uppercase
                            tracking-[0.12em]
                            text-black/35
                            transition
                            hover:text-black
                          "
                        >
                          Remove
                        </button>

                      </div>

                    </div>

                  )

                }
              )}

            </div>

          </section>

        )}


        {!selectedProject ? (

          <section className="rounded-[2rem] border border-black/10 bg-white/50 p-5 md:p-8">

            <button
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              className="
                flex
                min-h-[500px]
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
                Upload your photographs
              </span>


              <span className="mt-2 max-w-md text-sm leading-6 text-black/50">
                Select one photograph or a whole batch.
                Each photograph becomes its own Photo RANKD
                with seven individual RANKDs.
              </span>


              <span className="mt-6 rounded-full bg-black px-5 py-2.5 text-sm font-black text-white">
                Choose photos
              </span>

            </button>

          </section>

        ) : (

          <>

            {(selectedProject.saveMessage ||
              selectedProject.saveError ||
              selectedProject.publishedPhotoUrl) && (

              <div className="mb-6 space-y-3">

                {selectedProject.saveMessage && (
                  <div className="rounded-2xl bg-black px-5 py-4 text-sm font-bold text-white">
                    {selectedProject.saveMessage}
                  </div>
                )}


                {selectedProject.saveError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
                    {selectedProject.saveError}
                  </div>
                )}


                {selectedProject.publishedPhotoUrl && (
                  <div className="rounded-[1.5rem] border border-[#FF6B35]/30 bg-[#FF6B35]/10 p-5">

                    <p className="text-xs font-black uppercase tracking-[0.16em] text-black/45">
                      Published
                    </p>


                    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                      <div>

                        <p className="text-sm font-black">
                          This Photo RANKD is now live.
                        </p>


                        <p className="mt-1 text-xs text-black/50">
                          Seven individual RANKDs and their
                          hotspot positions are stored in Supabase.
                        </p>

                      </div>


                      <a
                        href={
                          selectedProject.publishedPhotoUrl
                        }
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


            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">

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
                    + Add more photos
                  </button>

                </div>


                <div className="overflow-hidden rounded-[2rem] bg-black shadow-[0_20px_70px_rgba(0,0,0,0.12)]">

                  <div className="relative aspect-[4/3] w-full">

                    <img
                      ref={
                        imageRef
                      }
                      src={
                        selectedProject.imageUrl
                      }
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

                      {selectedProject.rankings.map(
                        ranking => {

                          const isSelected =
                            ranking.id ===
                            selectedRankingId


                          const isDragging =
                            ranking.id ===
                            draggingId


                          const isSaved =
                            Boolean(
                              selectedProject.savedRankingIds[
                                ranking.id
                              ]
                            )


                          return (

                            <button
                              key={
                                ranking.id
                              }
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
                                left:
                                  `${ranking.x}%`,
                                top:
                                  `${ranking.y}%`,
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
                                  setOpenedId(
                                    null
                                  )
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
                                (
                                  item,
                                  index
                                ) => (

                                  <li
                                    key={
                                      `${openedRanking.id}-${index}`
                                    }
                                    className="flex gap-3 text-sm"
                                  >

                                    <span className="w-4 shrink-0 font-black text-black/35">
                                      {index + 1}
                                    </span>


                                    <span className="font-medium leading-5">
                                      {item || "Untitled item"}
                                    </span>

                                  </li>

                                )
                              )}

                            </ol>


                            <a
                              href={
                                createRankingHref(
                                  selectedProject,
                                  openedRanking
                                )
                              }
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
                              {selectedProject.savedRankingIds[
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
                          RANKD {selectedRanking?.id ?? 1} of 7
                        </p>


                        <h2 className="mt-2 text-2xl font-black leading-tight tracking-[-0.04em]">
                          {selectedRanking?.title}
                        </h2>

                      </div>


                      <span className="text-5xl font-black leading-none tracking-[-0.16em] text-[#FF6B35]/30">
                        7
                      </span>

                    </div>


                    {selectedRanking && (

                      <>

                        <label className="mt-6 block">

                          <span className="text-xs font-black uppercase tracking-[0.14em] text-black/40">
                            Title
                          </span>


                          <input
                            value={
                              selectedRanking.title
                            }
                            onChange={
                              event =>
                                updateRanking(
                                  selectedProject.id,
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
                            value={
                              selectedRanking.description
                            }
                            onChange={
                              event =>
                                updateRanking(
                                  selectedProject.id,
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

                          <div className="flex items-center justify-between gap-3">

                            <span className="text-xs font-black uppercase tracking-[0.14em] text-black/40">
                              Seven items
                            </span>


                            <span className="text-xs font-bold text-black/35">
                              Add links where useful
                            </span>

                          </div>


                          <div className="mt-2 space-y-3">

                            {selectedRanking.items.map(
                              (
                                item,
                                index
                              ) => (

                                <div
                                  key={
                                    `${selectedRanking.id}-${index}`
                                  }
                                  className="rounded-2xl border border-black/10 bg-[#F7F4EE] p-2"
                                >

                                  <div className="flex gap-2">

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/5 text-xs font-black text-black/45">
                                      {index + 1}
                                    </div>


                                    <input
                                      value={
                                        item
                                      }
                                      placeholder={
                                        `Item ${index + 1}`
                                      }
                                      onChange={
                                        event =>
                                          updateItem(
                                            selectedProject.id,
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
                                        bg-white
                                        px-3
                                        py-2
                                        text-sm
                                        outline-none
                                        transition
                                        focus:border-black/30
                                      "
                                    />

                                  </div>


                                  <div className="mt-2 flex gap-2">

                                    <span className="flex h-9 shrink-0 items-center rounded-xl bg-black/5 px-3 text-[10px] font-black uppercase tracking-[0.12em] text-black/35">
                                      LINK
                                    </span>


                                    <input
                                      type="url"
                                      value={
                                        selectedRanking.itemLinks[
                                          index
                                        ] ??
                                        ""
                                      }
                                      placeholder="Optional URL"
                                      onChange={
                                        event =>
                                          updateItemLink(
                                            selectedProject.id,
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
                                        bg-white
                                        px-3
                                        py-2
                                        text-xs
                                        font-medium
                                        outline-none
                                        transition
                                        placeholder:text-black/25
                                        focus:border-[#FF6B35]/50
                                        focus:ring-4
                                        focus:ring-[#FF6B35]/[0.05]
                                      "
                                    />

                                  </div>


                                  <p className="mt-1.5 pl-12 text-[10px] leading-4 text-black/30">
                                    Maps, YouTube, Spotify, articles or any other useful destination.
                                  </p>

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
                                {
                                  RANKING_CATEGORIES[
                                    selectedRanking.id
                                  ]
                                }
                              </p>

                            </div>


                            <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-black/45">
                              {
                                selectedProject.savedRankingIds[
                                  selectedRanking.id
                                ]
                                  ? "Saved"
                                  : "Not saved"
                              }
                            </span>

                          </div>

                        </div>

                      </>

                    )}

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

                          {selectedProject.rankings.map(
                            ranking => (

                              <button
                                key={
                                  ranking.id
                                }
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
                            setOpenedId(
                              null
                            )
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
                              (
                                item,
                                index
                              ) => {

                                const link =
                                  openedRanking.itemLinks[
                                    index
                                  ]?.trim()


                                return (

                                  <li
                                    key={
                                      `${openedRanking.id}-${index}`
                                    }
                                    className="flex gap-3"
                                  >

                                    <span className="w-5 shrink-0 text-sm font-black text-black/35">
                                      {index + 1}
                                    </span>


                                    <div className="min-w-0 flex-1">

                                      <span className="text-sm font-medium leading-5">
                                        {item || "Untitled item"}
                                      </span>


                                      {link && (
                                        <a
                                          href={
                                            link
                                          }
                                          target="_blank"
                                          rel="noreferrer"
                                          onClick={event =>
                                            event.stopPropagation()
                                          }
                                          className="
                                            mt-1
                                            block
                                            truncate
                                            text-[11px]
                                            font-bold
                                            text-[#FF6B35]
                                            hover:underline
                                          "
                                        >
                                          {link}
                                        </a>
                                      )}

                                    </div>

                                  </li>

                                )

                              }
                            )}

                          </ol>


                          <a
                            href={
                              createRankingHref(
                                selectedProject,
                                openedRanking
                              )
                            }
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
                            {
                              selectedProject.savedRankingIds[
                                openedRanking.id
                              ]
                                ? "Open RANKD →"
                                : "Create your RANKD version →"
                            }
                          </a>


                          <p className="mt-3 text-center text-[11px] leading-5 text-black/40">
                            {
                              selectedProject.savedRankingIds[
                                openedRanking.id
                              ]
                                ? "This is now a real RANKD and uses the normal RANK / RE-RANK experience."
                                : "Save the seven RANKDs above to make this a real RANKD."
                            }
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
                          Photo {projects.findIndex(
                            project =>
                              project.id ===
                              selectedProject.id
                          ) + 1} · Ready to publish
                        </p>


                        <p className="mt-1 text-xs leading-5 text-white/55">
                          This photograph will publish as one
                          Photo RANKD containing seven individual
                          RANKDs.
                        </p>

                      </div>

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        publishPhotoRankd(
                          selectedProject.id
                        )
                      }
                      disabled={
                        selectedProject.isPublishing ||
                        selectedProject.isSaving
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
                      {
                        selectedProject.isPublishing
                          ? "Publishing…"
                          : selectedProject.publishedPhotoId
                            ? "Published"
                            : "Publish Photo RANKD →"
                      }
                    </button>

                  </div>

                )}


                {selectedProject.publishedPhotoUrl && (

                  <a
                    href={
                      selectedProject.publishedPhotoUrl
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="
                      mt-4
                      block
                      rounded-[1.5rem]
                      border
                      border-black/10
                      bg-white/60
                      p-5
                      text-center
                      transition
                      hover:border-black/20
                      hover:bg-white
                    "
                  >

                    <p className="text-xs font-black uppercase tracking-[0.16em] text-black/40">
                      Live
                    </p>


                    <p className="mt-2 text-sm font-black">
                      Open published Photo RANKD →
                    </p>

                  </a>

                )}

              </aside>

            </div>

          </>

        )}

      </div>

    </main>
  )
}


function createRankingHref(
  project:
    PhotoProject,
  ranking:
    RankdDraft
) {

  const rankingId =
    project.savedRankingIds[
      ranking.id
    ]


  if (
    rankingId
  ) {

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
      ranking.items.map(
        (
          name,
          index
        ) => ({
          name,
          externalUrl:
            ranking.itemLinks[
              index
            ]?.trim() ||
            undefined
        })
      )
    )
  )


  return `/create?${params.toString()}`

}