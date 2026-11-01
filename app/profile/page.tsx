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

import ProfileIdentity from "@/components/ProfileIdentity"

import ProfileRankingTile from "@/components/ProfileRankingTile"

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

        <ProfileIdentity
          displayName={
            profile.display_name
          }
          username={
            profile.username
          }
          rankingCount={
            rankings.length
          }
          tagline="Your rankings. Your taste. Your RANKD."
          actions={
            <>
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
                "
              >
                Create another Top 7 →
              </Link>
            </>
          }
        />


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
              border-black
              pb-5
              text-center
            "
          >

            <p
              className="
                text-[11px]
                font-black
                uppercase
                tracking-[0.22em]
                text-[#FF6B35]
              "
            >
              RANKD / YOURS
            </p>

            <h2
              className="
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


          {
            rankings.length === 0 && (

              <div
                className="
                  mt-8
                  rounded-[28px]
                  border
                  border-black
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
                ranking => (
                  <ProfileRankingTile
                    key={
                      ranking.id
                    }
                    id={
                      ranking.id
                    }
                    title={
                      ranking.title
                    }
                    category={
                      ranking.category
                    }
                    engagement={
                      ranking.engagement
                    }
                  />
                )
              )
            }

          </div>

        </section>

      </div>

    </main>

  )

}