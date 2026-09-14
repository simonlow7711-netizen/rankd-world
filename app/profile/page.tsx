"use client"

import {
  useEffect,
  useState
} from "react"

import {
  useRouter
} from "next/navigation"

import Link from "next/link"

import {
  supabase
} from "@/utils/supabase"

import {
  formatRankingTitle
} from "@/utils/rankingTitle"

import RankingEngagement from "@/components/RankingEngagement"

import {
  getRankingEngagement,
  RankingEngagementData
} from "@/utils/rankingEngagement"


type Profile = {
  id: string
  username: string
  display_name: string
}


type Ranking = {
  id: string
  title: string
  category: string | null
  description: string | null
  views: number | null
  created_at: string | null
  engagement: RankingEngagementData
}


type CategoryTheme = {
  bg: string
  text: string
  accent: string
  muted: string
  border: string
}


const categoryThemes: Record<string, CategoryTheme> = {

  "Food & Drink": {
    bg: "#F3E8D8",
    text: "#211A16",
    accent: "#D96B35",
    muted: "#6E5545",
    border: "rgba(217,107,53,0.16)"
  },

  "Film & TV": {
    bg: "#ECEAE5",
    text: "#151515",
    accent: "#FF6B35",
    muted: "#686560",
    border: "rgba(255,107,53,0.16)"
  },

  "Music": {
    bg: "#E9E3DE",
    text: "#211A1A",
    accent: "#C43D35",
    muted: "#746562",
    border: "rgba(196,61,53,0.16)"
  },

  "Sport": {
    bg: "#E7EBE5",
    text: "#101510",
    accent: "#E54B2F",
    muted: "#586058",
    border: "rgba(229,75,47,0.16)"
  },

  "Gaming": {
    bg: "#E7ECE9",
    text: "#0E1416",
    accent: "#39A932",
    muted: "#59645F",
    border: "rgba(57,169,50,0.16)"
  },

  "Travel": {
    bg: "#E0ECE8",
    text: "#123B36",
    accent: "#087D71",
    muted: "#58736F",
    border: "rgba(8,125,113,0.16)"
  },

  "Technology": {
    bg: "#E9EBE9",
    text: "#111820",
    accent: "#315AE8",
    muted: "#69737C",
    border: "rgba(49,90,232,0.16)"
  },

  "Lifestyle": {
    bg: "#EEE8DE",
    text: "#29241E",
    accent: "#A45D3E",
    muted: "#766E64",
    border: "rgba(164,93,62,0.16)"
  },

  "Books": {
    bg: "#F1EBDD",
    text: "#30251D",
    accent: "#9B493D",
    muted: "#75695E",
    border: "rgba(155,73,61,0.16)"
  },

  "Art & Design": {
    bg: "#E9E6DF",
    text: "#151515",
    accent: "#B58B18",
    muted: "#68645C",
    border: "rgba(181,139,24,0.16)"
  },

  "Fashion": {
    bg: "#ECE3E9",
    text: "#231B22",
    accent: "#A52F68",
    muted: "#786773",
    border: "rgba(165,47,104,0.16)"
  },

  "Beauty": {
    bg: "#F1E5E3",
    text: "#2C1C1F",
    accent: "#C34E68",
    muted: "#856B70",
    border: "rgba(195,78,104,0.16)"
  },

  "Health & Fitness": {
    bg: "#E4EEE6",
    text: "#17251B",
    accent: "#16824D",
    muted: "#607467",
    border: "rgba(22,130,77,0.16)"
  },

  "Business": {
    bg: "#E5E9EE",
    text: "#14202B",
    accent: "#245A91",
    muted: "#64717D",
    border: "rgba(36,90,145,0.16)"
  },

  "Science": {
    bg: "#E0EAEC",
    text: "#14272C",
    accent: "#157D8C",
    muted: "#61767C",
    border: "rgba(21,125,140,0.16)"
  },

  "History": {
    bg: "#E9E0CF",
    text: "#2D2419",
    accent: "#86502E",
    muted: "#766A5B",
    border: "rgba(134,80,46,0.16)"
  },

  "Nature & Animals": {
    bg: "#E0E9DC",
    text: "#172418",
    accent: "#4C7D3F",
    muted: "#62715E",
    border: "rgba(76,125,63,0.16)"
  },

  "Cars & Transport": {
    bg: "#E2E5E7",
    text: "#141B20",
    accent: "#C63D2E",
    muted: "#68737B",
    border: "rgba(198,61,46,0.16)"
  },

  "Home & Garden": {
    bg: "#E9E7DD",
    text: "#25251E",
    accent: "#6E7C45",
    muted: "#707064",
    border: "rgba(110,124,69,0.16)"
  },

  "General": {
    bg: "#F7F4EE",
    text: "#000000",
    accent: "#FF6B35",
    muted: "#68645C",
    border: "rgba(255,107,53,0.16)"
  }

}


function getTheme(
  category: string | null
): CategoryTheme {

  return (
    categoryThemes[
      category ?? "General"
    ] ??
    categoryThemes["General"]
  )

}


export default function ProfilePage() {

  const router =
    useRouter()


  const [
    profile,
    setProfile
  ] =
    useState<Profile | null>(null)


  const [
    rankings,
    setRankings
  ] =
    useState<Ranking[]>([])


  const [
    loading,
    setLoading
  ] =
    useState(true)


  useEffect(() => {

    async function loadProfile() {

      const {
        data: {
          user
        }
      } =
        await supabase.auth.getUser()


      if (!user) {

        router.push(
          "/onboarding"
        )

        return

      }


      const {
        data: profileData,
        error: profileError
      } =
        await supabase
          .from("profiles")
          .select(
            "id,username,display_name"
          )
          .eq(
            "id",
            user.id
          )
          .single()


      if (
        profileError ||
        !profileData
      ) {

        router.push(
          "/onboarding"
        )

        return

      }


      setProfile(
        profileData
      )


      const {
        data: rankingData
      } =
        await supabase
          .from("rankings")
          .select(
            `
            id,
            title,
            category,
            description,
            views,
            created_at
            `
          )
          .eq(
            "user_id",
            user.id
          )
          .order(
            "created_at",
            {
              ascending: false
            }
          )


      const rankingsWithEngagement =
        await Promise.all(
          (
            rankingData ??
            []
          ).map(
            async ranking => {

              const engagement =
                await getRankingEngagement(
                  ranking.id
                )


              return {
                ...ranking,
                engagement
              }

            }
          )
        )


      setRankings(
        rankingsWithEngagement
      )


      setLoading(
        false
      )

    }


    loadProfile()

  }, [
    router
  ])


  if (loading) {

    return (

      <main
        className="
          min-h-screen
          bg-[#F7F4EE]
          flex
          items-center
          justify-center
          px-6
        "
      >

        <p
          className="
            text-lg
            font-black
            tracking-[-0.03em]
          "
        >
          Loading your RANKD...
        </p>

      </main>

    )

  }


  if (!profile) {

    return null

  }


  return (

    <main
      className="
        min-h-screen
        bg-[#F7F4EE]
        text-black
        px-6
        py-10
        md:py-14
      "
    >

      <div
        className="
          mx-auto
          max-w-6xl
        "
      >

        <section
          className="
            relative
            overflow-hidden
            rounded-[28px]
            border
            border-black/[0.06]
            bg-white/30
            px-7
            py-8
            md:px-10
            md:py-10
          "
        >

          <div
            className="
              pointer-events-none
              absolute
              -right-6
              -top-10
              select-none
              text-[10rem]
              font-black
              leading-none
              tracking-[-0.14em]
              text-[#FF6B35]/[0.07]
              md:-right-2
              md:-top-14
              md:text-[14rem]
            "
            aria-hidden="true"
          >
            7
          </div>


          <div
            className="
              relative
              z-10
            "
          >

            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.2em]
                text-black/40
              "
            >
              RANKD / IDENTITY
            </p>


            <div
              className="
                mt-4
                flex
                flex-wrap
                items-end
                gap-x-10
                gap-y-5
              "
            >

              <div>

                <h1
                  className="
                    text-4xl
                    font-black
                    leading-[0.95]
                    tracking-[-0.055em]
                    md:text-6xl
                  "
                >
                  {profile.display_name}
                </h1>


                <p
                  className="
                    mt-2
                    text-lg
                    font-bold
                    tracking-[-0.02em]
                    text-black/40
                    md:text-xl
                  "
                >
                  @{profile.username}
                </p>

              </div>


              <div
                className="
                  flex
                  items-end
                  gap-3
                  pb-0.5
                "
              >

                <p
                  className="
                    text-6xl
                    font-black
                    leading-[0.8]
                    tracking-[-0.065em]
                    text-[#FF6B35]
                    md:text-7xl
                  "
                >
                  {rankings.length}
                </p>


                <p
                  className="
                    pb-1
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-black/45
                  "
                >
                  RANKDs
                </p>

              </div>

            </div>


            <p
              className="
                mt-6
                whitespace-nowrap
                text-sm
                font-bold
                tracking-[-0.02em]
                text-black/60
                md:text-base
              "
            >
              Your rankings. Your taste. Your RANKD.
            </p>


            <div
              className="
                mt-7
                flex
                flex-wrap
                gap-3
                border-t
                border-black/[0.07]
                pt-6
              "
            >

              <Link
                href="/onboarding"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-full
                  bg-black
                  px-7
                  py-3.5
                  text-sm
                  font-black
                  text-white
                  transition
                  hover:bg-[#FF6B35]
                  hover:text-black
                "
              >
                Edit identity
              </Link>


              <Link
                href="/create"
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-black
                  px-7
                  py-3.5
                  text-sm
                  font-black
                  transition
                  hover:bg-black
                  hover:text-white
                "
              >
                Create another Top 7 →
              </Link>

            </div>

          </div>

        </section>


        <section
          className="
            mt-14
            md:mt-16
          "
        >

          <div
            className="
              flex
              items-end
              justify-between
              gap-6
              border-b
              border-black/[0.08]
              pb-5
            "
          >

            <div>

              <p
                className="
                  text-xs
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-black/35
                "
              >
                RANKD / YOURS
              </p>


              <h2
                className="
                  mt-2
                  text-4xl
                  font-black
                  leading-none
                  tracking-[-0.045em]
                  md:text-5xl
                "
              >
                Your RANKDs
              </h2>

            </div>


            <p
              className="
                hidden
                text-sm
                font-bold
                text-black/35
                sm:block
              "
            >
              {rankings.length}
              {" "}
              {rankings.length === 1 ? "ranking" : "rankings"}
            </p>

          </div>


          {
            rankings.length === 0 && (

              <div
                className="
                  mt-8
                  rounded-[28px]
                  border
                  border-black/[0.06]
                  bg-white/30
                  p-10
                  text-center
                  md:p-14
                "
              >

                <div
                  className="
                    text-7xl
                    font-black
                    leading-none
                    text-[#FF6B35]/[0.12]
                  "
                  aria-hidden="true"
                >
                  7
                </div>


                <p
                  className="
                    mt-5
                    text-xl
                    font-black
                    tracking-[-0.025em]
                  "
                >
                  You haven't created your first RANKD yet.
                </p>


                <Link
                  href="/create"
                  className="
                    mt-7
                    inline-flex
                    items-center
                    justify-center
                    rounded-full
                    bg-black
                    px-7
                    py-3.5
                    text-sm
                    font-black
                    text-white
                    transition
                    hover:bg-[#FF6B35]
                    hover:text-black
                  "
                >
                  Create your first →
                </Link>

              </div>

            )
          }


          <div
            className="
              mt-8
              grid
              gap-5
              md:grid-cols-2
            "
          >

            {
              rankings.map(
                ranking => {

                  const theme =
                    getTheme(
                      ranking.category
                    )


                  return (

                    <Link
                      key={
                        ranking.id
                      }
                      href={
                        `/rank/${ranking.id}`
                      }
                      className="
                        group
                        relative
                        overflow-hidden
                        rounded-[28px]
                        p-7
                        transition
                        duration-200
                        hover:-translate-y-1
                      "
                      style={{
                        backgroundColor:
                          theme.bg,

                        color:
                          theme.text,

                        border:
                          `1px solid ${theme.border}`
                      }}
                    >

                      <div
                        className="
                          pointer-events-none
                          absolute
                          -right-4
                          -top-7
                          select-none
                          text-[7rem]
                          font-black
                          leading-none
                          tracking-[-0.14em]
                          opacity-[0.055]
                          transition
                          duration-200
                          group-hover:opacity-[0.08]
                        "
                        aria-hidden="true"
                      >
                        7
                      </div>


                      <div
                        className="
                          relative
                          z-10
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            justify-between
                            gap-4
                          "
                        >

                          <p
                            className="
                              text-xs
                              font-black
                              uppercase
                              tracking-[0.18em]
                            "
                            style={{
                              color:
                                theme.muted
                            }}
                          >
                            RANKD /{" "}
                            {ranking.category ?? "GENERAL"}
                          </p>


                          <span
                            className="
                              text-xs
                              font-black
                              uppercase
                              tracking-[0.14em]
                            "
                            style={{
                              color:
                                theme.accent
                            }}
                          >
                            07
                          </span>

                        </div>


                        <h3
                          className="
                            mt-5
                            max-w-xl
                            text-3xl
                            font-black
                            leading-[1.05]
                            tracking-[-0.04em]
                            md:text-4xl
                          "
                        >
                          {
                            formatRankingTitle(
                              ranking.title
                            )
                          }
                        </h3>


                        <div
                          className="
                            mt-7
                          "
                        >

                          <RankingEngagement
                            views={
                              ranking.engagement.views
                            }
                            rankd={
                              ranking.engagement.rankd
                            }
                            rerankd={
                              ranking.engagement.rerankd
                            }
                          />

                        </div>


                        <div
                          className="
                            mt-7
                            flex
                            items-center
                            justify-between
                            gap-4
                            border-t
                            pt-5
                          "
                          style={{
                            borderColor:
                              `${theme.text}14`
                          }}
                        >

                          <p
                            className="
                              text-sm
                              font-black
                            "
                            style={{
                              color:
                                theme.muted
                            }}
                          >
                            View conversation
                          </p>


                          <span
                            className="
                              text-lg
                              font-black
                              transition
                              group-hover:translate-x-1
                            "
                            style={{
                              color:
                                theme.accent
                            }}
                          >
                            →
                          </span>

                        </div>

                      </div>

                    </Link>

                  )

                }
              )
            }

          </div>

        </section>

      </div>

    </main>

  )

}