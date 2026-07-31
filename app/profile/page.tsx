"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"

import TasteDNA from "@/components/TasteDNA"
import Achievements from "@/components/Achievements"

import { calculateTasteDNA } from "@/utils/tasteProfile"
import { calculateAchievements } from "@/utils/achievements"

import {
  getProfileByUsername
} from "@/utils/supabaseProfiles"

import {
  getUserRankings
} from "@/utils/supabaseRankings"



export default function PublicProfilePage(){


  const params = useParams()

  const username =
    params.username as string



  const [profile,setProfile] =
    useState<any>(null)



  const [rankings,setRankings] =
    useState<any[]>([])



  const [loading,setLoading] =
    useState(true)





  useEffect(()=>{


    async function loadProfile(){


      const profileData =
        await getProfileByUsername(username)



      if(!profileData){

        setLoading(false)

        return

      }





      setProfile(profileData)





      const userRankings =
        await getUserRankings(profileData.id)



      setRankings(userRankings)



      setLoading(false)


    }



    loadProfile()



  },[username])








  if(loading){


    return (

      <main className="
        min-h-screen
        bg-black
        text-white
        p-10
      ">

        Loading...

      </main>

    )

  }








  if(!profile){


    return (

      <main className="
        min-h-screen
        bg-black
        text-white
        p-10
      ">


        <h1 className="
          text-4xl
          font-black
        ">

          Profile not found

        </h1>


      </main>

    )

  }








  const categories = new Set(

    rankings.map(

      ranking => ranking.category

    )

  )





  const tasteData =
    calculateTasteDNA(rankings)



  const achievementData =
    calculateAchievements(rankings)








  return (

    <main className="
      min-h-screen
      bg-black
      text-white
      px-6
      py-16
    ">



      <div className="
        max-w-5xl
        mx-auto
      ">






        <div className="
          bg-zinc-900
          rounded-3xl
          p-10
          mb-12
        ">



          <h1 className="
            text-5xl
            font-black
          ">

            {profile.display_name}

          </h1>






          <p className="
            mt-3
            text-gray-400
          ">

            @{profile.username}

          </p>






          <p className="
            mt-3
            text-gray-400
          ">

            RANKD identity.

          </p>








          <div className="
            mt-10
            grid
            md:grid-cols-3
            gap-6
          ">





            <div className="
              bg-black
              rounded-2xl
              p-6
            ">

              <p className="text-gray-500">

                RANKDs Created

              </p>


              <p className="
                text-4xl
                font-black
                mt-2
              ">

                {rankings.length}

              </p>


            </div>







            <div className="
              bg-black
              rounded-2xl
              p-6
            ">

              <p className="text-gray-500">

                Categories

              </p>


              <p className="
                text-4xl
                font-black
                mt-2
              ">

                {categories.size}

              </p>


            </div>







            <div className="
              bg-black
              rounded-2xl
              p-6
            ">

              <p className="text-gray-500">

                Achievements

              </p>


              <p className="
                text-4xl
                font-black
                mt-2
              ">

                {achievementData.length}

              </p>


            </div>



          </div>






        </div>








        <TasteDNA

          data={tasteData}

        />








        <Achievements

          achievements={achievementData}

        />








        <h2 className="
          text-3xl
          font-black
          mb-8
        ">

          {profile.display_name}'s RANKDs

        </h2>







        <div className="
          space-y-4
        ">






          {rankings.length === 0 && (

            <div className="
              bg-zinc-900
              rounded-2xl
              p-8
            ">

              <p className="
                text-xl
                font-bold
              ">

                No RANKDs created yet.

              </p>


            </div>

          )}








          {rankings.map((ranking)=>(


            <Link

              key={ranking.id}

              href={`/rank/${ranking.id}`}

            >


              <div className="
                bg-white
                text-black
                rounded-2xl
                p-6
                mb-4
                hover:scale-[1.02]
                transition
              ">


                <p className="text-gray-500">

                  #{ranking.category}

                </p>




                <h3 className="
                  text-2xl
                  font-black
                ">

                  {ranking.title}

                </h3>


              </div>


            </Link>


          ))}



        </div>








      </div>



    </main>

  )


}