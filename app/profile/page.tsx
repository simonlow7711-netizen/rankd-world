"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import Link from "next/link"

import { supabase } from "@/utils/supabase"



type Profile = {

  id:string

  username:string

  display_name:string

}



type Ranking = {

  id:string

  title:string

  category:string | null

  description:string | null

  views:number | null

  created_at:string | null

}







export default function ProfilePage(){


  const router = useRouter()


  const [profile,setProfile] =
    useState<Profile | null>(null)



  const [rankings,setRankings] =
    useState<Ranking[]>([])



  const [loading,setLoading] =
    useState(true)









  useEffect(()=>{


    async function loadProfile(){



      const {
        data:{
          user
        }

      } = await supabase.auth.getUser()






      if(!user){


        router.push("/onboarding")


        return

      }








      const {
        data:profileData,
        error:profileError

      } = await supabase

        .from("profiles")

        .select(
          "id, username, display_name"
        )

        .eq(
          "id",
          user.id
        )

        .single()






      if(profileError || !profileData){


        console.error(profileError)


        router.push("/onboarding")


        return

      }






      setProfile(profileData)








      const {
        data:rankingData,
        error:rankingError

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
          user.id
        )

        .order(
          "created_at",
          {
            ascending:false
          }
        )








      if(rankingError){


        console.error(rankingError)


      } else {


        setRankings(
          rankingData ?? []
        )


      }






      setLoading(false)



    }




    loadProfile()



  },[router])









  if(loading){


    return (

      <main className="
        min-h-screen
        bg-black
        text-white
        p-10
      ">

        Loading profile...

      </main>

    )

  }








  if(!profile){


    return null


  }









  return (

    <main className="
      min-h-screen
      bg-black
      text-white
      p-8
    ">


      <div className="
        max-w-4xl
        mx-auto
      ">





        <section className="
          bg-zinc-900
          rounded-3xl
          p-8
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
            text-xl
          ">

            @{profile.username}

          </p>


        </section>








        <section className="
          mt-10
        ">


          <h2 className="
            text-3xl
            font-black
            mb-6
          ">

            Your RANKDs

          </h2>








          {rankings.length === 0 && (


            <div className="
              bg-zinc-900
              rounded-3xl
              p-8
            ">

              <p className="
                text-gray-400
              ">

                You haven't created any RANKDs yet.

              </p>


            </div>


          )}









          <div className="
            grid
            gap-6
          ">


            {rankings.map((ranking)=>(


              <Link

                key={ranking.id}

                href={`/rank/${ranking.id}`}

                className="
                  bg-white
                  text-black
                  rounded-3xl
                  p-6
                  hover:scale-[1.02]
                  transition
                "

              >


                <h3 className="
                  text-2xl
                  font-black
                ">

                  {ranking.title}

                </h3>




                <p className="
                  mt-2
                  text-gray-600
                ">

                  #{ranking.category ?? "General"}

                </p>




                <p className="
                  mt-4
                  text-sm
                  text-gray-500
                ">

                  {ranking.views ?? 0} views

                </p>



              </Link>


            ))}


          </div>


        </section>





      </div>


    </main>

  )


}