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

import EditionChrome from "@/components/EditionChrome"

import {
  getRankingEngagement,
  RankingEngagementData
} from "@/utils/rankingEngagement"

import {
  getCategoryTheme
} from "@/utils/categoryTheme"


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


function getTheme(
  category?: string | null
) {

  return getCategoryTheme(
    category
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
            bg-[#F7F4EE]
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
              flex-col
              items-center
              gap-3
              border-b
              border-black/[0.08]
              pb-5
              text-center
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
                text-sm
                font-bold
                text-black/35
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
                  bg-[#F7F4EE]
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
                        rankd-edition
                        group
                        relative
                        overflow-hidden
                        rounded-[28px]
                        border
                        p-7
                        text-black
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
                          text-center
                        "
                      >

                        <div
                          className="
                            flex
                            items-center
                            justify-center
                            gap-3
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
                            mx-auto
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
                            justify-center
                            gap-3
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