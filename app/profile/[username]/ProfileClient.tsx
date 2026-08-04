"use client"

import {
  useEffect,
  useState
} from "react"

import Link from "next/link"

import {
  supabase
} from "@/utils/supabase"

import ProfileCard from "@/components/ProfileCard"

import ShareCard from "@/components/ShareCard"

import TasteDNA from "@/components/TasteDNA"

import Achievements from "@/components/Achievements"

import {
  calculateTasteDNA
} from "@/utils/tasteProfile"

import {
  calculateAchievements
} from "@/utils/achievements"





type Props = {

  username:string

}





export default function ProfileClient({

  username

}:Props){



  const [profile,setProfile] =

    useState<any>(null)



  const [rankings,setRankings] =

    useState<any[]>([])



  const [loading,setLoading] =

    useState(true)









  useEffect(()=>{


    async function load(){



      const {

        data:profileData

      } = await supabase

        .from("profiles")

        .select(

          "id,username,display_name"

        )

        .eq(

          "username",

          username

        )

        .single()








      if(!profileData){


        setLoading(false)

        return


      }








      setProfile(

        profileData

      )









      const {

        data:rankingData

      } = await supabase

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

            ascending:false

          }

        )








      setRankings(

        rankingData ?? []

      )





      setLoading(false)



    }






    load()



  },[username])









  if(loading){


    return (

      <main className="
        min-h-screen
        bg-[#F7F4EE]
        flex
        items-center
        justify-center
        font-black
      ">

        Loading profile...

      </main>

    )

  }









  if(!profile){


    return (

      <main className="
        min-h-screen
        bg-[#F7F4EE]
        flex
        items-center
        justify-content-center
        font-black
      ">

        Profile not found

      </main>

    )

  }








  const tasteData =

    calculateTasteDNA(

      rankings

    )







  const achievementData =

    calculateAchievements(

      rankings

    )







  const categories =

    new Set(

      rankings.map(

        ranking =>

          ranking.category

      )

    )







  return (

    <main className="
      min-h-screen
      bg-[#F7F4EE]
      text-black
      px-6
      py-16
    ">


      <div className="
        max-w-5xl
        mx-auto
      ">



        <section className="
          rankd-card
          p-10
          mb-12
          text-center
        ">


          <div className="
            text-7xl
            font-black
            opacity-10
          ">

            7

          </div>




          <h1 className="
            text-5xl
            font-black
            -mt-10
          ">

            {profile.display_name}

          </h1>




          <p className="
            mt-3
            rankd-muted
          ">

            @{profile.username}

          </p>




          <div className="
            mt-10
            grid
            md:grid-cols-3
            gap-5
          ">


            <Stat

              label="RANKDs"

              value={rankings.length}

            />


            <Stat

              label="Categories"

              value={categories.size}

            />


            <Stat

              label="Achievements"

              value={achievementData.length}

            />


          </div>



        </section>







        <ShareCard

          username={profile.username}

          rankings={rankings}

          achievements={achievementData}

        />







        <ProfileCard

          username={profile.username}

          rankings={rankings}

          achievements={achievementData}

        />







        <TasteDNA

          data={tasteData}

        />







        <Achievements

          achievements={achievementData}

        />







        <h2 className="
          text-4xl
          font-black
          mt-12
          mb-8
        ">

          Rankings

        </h2>







        <div className="
          space-y-5
        ">



          {rankings.map(ranking=>(


            <Link

              key={ranking.id}

              href={`/rank/${ranking.id}`}

              className="
                block
              "

            >


              <div className="
                rankd-card
                p-6
              ">


                <p className="
                  rankd-accent
                  font-black
                  uppercase
                ">

                  {ranking.category || "General"}

                </p>




                <h3 className="
                  text-3xl
                  font-black
                  mt-3
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







function Stat({

  label,

  value

}:{

  label:string

  value:number

}){


  return (

    <div className="
      bg-white
      rounded-2xl
      p-5
    ">


      <p className="
        rankd-muted
      ">

        {label}

      </p>



      <p className="
        text-4xl
        font-black
        mt-2
      ">

        {value}

      </p>


    </div>

  )

}