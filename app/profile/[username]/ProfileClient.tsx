"use client"

import {
  useEffect,
  useState
} from "react"

import ProfileIdentity from "@/components/ProfileIdentity"

import ProfileRankingTile from "@/components/ProfileRankingTile"

import {
  supabase
} from "@/utils/supabase"

import {
  getRankingEngagement,
  RankingEngagementData
} from "@/utils/rankingEngagement"


type Props = {
  username: string
}


type Profile = {
  id: string
  username: string
  display_name: string
}


type Ranking = {
  id: string
  title: string
  category: string | null
  engagement: RankingEngagementData
}


export default function ProfileClient({
  username
}: Props) {

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

    async function load() {

      const {
        data: profileData
      } =
        await supabase
          .from("profiles")
          .select(
            "id,username,display_name"
          )
          .eq(
            "username",
            username
          )
          .single()

      if (!profileData) {
        setLoading(false)
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
            profileData.id
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
                id:
                  ranking.id,
                title:
                  ranking.title,
                category:
                  ranking.category,
                engagement
              }

            }
          )
        )

      setRankings(
        rankingsWithEngagement
      )

      setLoading(false)

    }

    load()

  }, [username])

  if (loading) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#F7F4EE]
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
          Loading profile...
        </p>
      </main>
    )
  }

  if (!profile) {
    return (
      <main
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-[#F7F4EE]
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
          Profile not found
        </p>
      </main>
    )
  }

  return (
    <main
      className="
        min-h-screen
        bg-[#F7F4EE]
        px-6
        py-10
        text-black
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
          tagline="Discover my Top 7 everything."
          shareable
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
              RANKD / THEIRS
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
              RANKDs
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
                <p
                  className="
                    text-xl
                    font-black
                    tracking-[-0.025em]
                  "
                >
                  No RANKDs yet.
                </p>
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
