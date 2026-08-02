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
          "id,username,display_name"
        )

        .eq(
          "id",
          user.id
        )

        .single()








      if(profileError || !profileData){


        router.push("/onboarding")

        return

      }








      setProfile(profileData)









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
          user.id
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





    loadProfile()



  },[router])












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

        Loading your opinions...

      </main>

    )

  }








  if(!profile){

    return null

  }









  return (

    <main className="
      min-h-screen
      bg-[#F7F4EE]
      text-black
      px-6
      py-12
    ">


      <div className="
        max-w-6xl
        mx-auto
      ">









        <section className="
          rankd-card
          p-10
          md:p-14
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
            md:text-7xl
            font-black
            -mt-10
          ">

            {profile.display_name}

          </h1>







          <p className="
            mt-4
            text-xl
            text-gray-500
          ">

            @{profile.username}

          </p>








          <div className="
            mt-10
            flex
            justify-center
            gap-6
            flex-wrap
          ">




            <div>

              <p className="
                text-4xl
                font-black
              ">

                {rankings.length}

              </p>


              <p className="
                text-gray-500
                font-bold
              ">

                RANKDs

              </p>

            </div>





            <div>

              <p className="
                text-4xl
                font-black
              ">

                {rankings.reduce(
                  (total,item)=>
                  total+(item.views ?? 0),
                  0
                )}

              </p>


              <p className="
                text-gray-500
                font-bold
              ">

                Views

              </p>

            </div>



          </div>








          <Link

            href="/create"

            className="
              inline-block
              mt-10
              rankd-button
            "

          >

            Create another Top 7 →

          </Link>




        </section>









        <section className="
          mt-16
        ">


          <h2 className="
            text-4xl
            font-black
            mb-8
          ">

            Your opinions

          </h2>








          {rankings.length === 0 && (


            <div className="
              rankd-card
              p-10
              text-center
            ">


              <p className="
                text-xl
                font-bold
              ">

                You haven't created your first RANKD yet.

              </p>



              <Link

                href="/create"

                className="
                  inline-block
                  mt-6
                  rankd-button
                "

              >

                Create your first →

              </Link>


            </div>


          )}









          <div className="
            grid
            md:grid-cols-2
            gap-8
          ">



            {rankings.map((ranking)=>(


              <Link

                key={ranking.id}

                href={`/rank/${ranking.id}`}

                className="
                  rankd-card
                  p-8
                  hover:-translate-y-1
                  transition
                "

              >



                <p className="
                  rankd-accent
                  font-black
                  uppercase
                  tracking-wide
                  text-sm
                ">

                  #{ranking.category ?? "General"}

                </p>





                <h3 className="
                  text-3xl
                  font-black
                  mt-4
                ">

                  {ranking.title}

                </h3>





                <p className="
                  mt-6
                  text-gray-500
                ">

                  {ranking.views ?? 0} people viewed this opinion

                </p>





                <p className="
                  mt-6
                  font-black
                ">

                  View conversation →

                </p>




              </Link>


            ))}


          </div>


        </section>






      </div>


    </main>

  )


}