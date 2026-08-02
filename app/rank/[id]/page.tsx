"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

import { trackEvent } from "@/utils/analytics"
import { getSupabaseRanking } from "@/utils/supabaseRankings"
import { supabase } from "@/utils/supabase"


export default function RankPage() {


  const params = useParams()

  const router = useRouter()


  const id =
    params.id as string



  const [ranking,setRanking] =
    useState<any>(null)


  const [originalRanking,setOriginalRanking] =
    useState<any>(null)


  const [remixes,setRemixes] =
    useState<any[]>([])


  const [loading,setLoading] =
    useState(true)






  useEffect(()=>{


    async function load(){


      trackEvent(

        "ranking_viewed",

        {
          rankingId:id
        }

      )





      const current =
        await getSupabaseRanking(id)





      console.log(
        "CURRENT RANKING:",
        current
      )





      if(!current){

        setLoading(false)

        return

      }





      setRanking(current)





      let rootId =
        current.id





      if(current.parentId){


        rootId =
          current.parentId





        const parent =
          await getSupabaseRanking(
            current.parentId
          )


        setOriginalRanking(parent)

      }







      const {

        data:childRankings,

        error

      } = await supabase

        .from("rankings")

        .select(
          "id,title,parent_id,created_at"
        )

        .eq(
          "parent_id",
          rootId
        )

        .order(
          "created_at",
          {
            ascending:false
          }
        )







      if(error){

        console.error(
          "REMIX ERROR:",
          error
        )

      }







      const formattedRemixes =

        (childRankings ?? [])

          .map((item:any)=>({

            id:item.id,

            title:item.title,

            parentId:item.parent_id

          }))





      console.log(
        "FORMATTED REMIXES:",
        formattedRemixes
      )





      setRemixes(
        formattedRemixes
      )





      setLoading(false)



    }





    load()


  },[id])









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







  if(!ranking){


    return (

      <main className="
        min-h-screen
        bg-black
        text-white
        p-10
      ">

        Ranking not found

      </main>

    )

  }








  function rankIt(){


    const items =

      ranking.items

        .map(
          (item:any)=>item.name
        )

        .join("|")





    router.push(

      `/create?title=${encodeURIComponent(
        ranking.title
      )}&items=${encodeURIComponent(
        items
      )}&originalId=${ranking.parentId || ranking.id}`

    )


  }









  return (

    <main className="
      min-h-screen
      bg-black
      text-white
      p-8
    ">


      <div className="
        max-w-6xl
        mx-auto
        grid
        lg:grid-cols-3
        gap-8
      ">


        <section className="
          lg:col-span-2
        ">





          {originalRanking && (

            <button

              onClick={()=>router.push(
                `/rank/${originalRanking.id}`
              )}

              className="
                w-full
                mb-8
                bg-zinc-900
                hover:bg-zinc-800
                rounded-3xl
                p-6
                text-left
                transition
              "

            >

              <p className="
                text-sm
                uppercase
                tracking-widest
                text-gray-500
                font-bold
              ">

                ✨ Inspired by

              </p>


              <h2 className="
                mt-2
                text-2xl
                font-black
              ">

                {originalRanking.title}

              </h2>


              <p className="
                mt-3
                text-gray-400
              ">

                This Top 7 was inspired by another perspective.

              </p>


              <p className="
                mt-5
                font-bold
              ">

                View the original →

              </p>


            </button>

          )}
                    <p className="
            text-gray-400
          ">

            #{ranking.category}

          </p>







          <h1 className="
            mt-4
            text-5xl
            font-black
          ">

            {ranking.title}

          </h1>







          <p className="
            mt-4
            text-gray-400
          ">

            Created by {ranking.creator}

          </p>







          <button

            onClick={rankIt}

            className="
              mt-8
              w-full
              bg-white
              text-black
              py-5
              rounded-full
              font-black
              text-xl
            "

          >

            RANKD IT

          </button>








          <div className="
            mt-10
            space-y-4
          ">


            {ranking.items.map((item:any)=>(


              <div

                key={item.position}

                className="
                  bg-white
                  text-black
                  rounded-2xl
                  p-5
                  flex
                  justify-between
                  items-center
                "

              >

                <span className="
                  font-bold
                ">

                  #{item.position} {item.name}

                </span>


                <span>

                  {item.votes}

                </span>


              </div>


            ))}


          </div>






        </section>









        <aside className="
          space-y-6
        ">








          <div className="
            bg-zinc-900
            rounded-3xl
            p-6
          ">


            <h2 className="
              text-2xl
              font-black
            ">

              🔥 Different Perspectives

            </h2>





            <p className="
              mt-2
              text-gray-400
            ">

              {remixes.length === 0

                ? "Be the first person to rank this differently."

                : `${remixes.length} people ranked this differently.`

              }

            </p>








            <div className="
              mt-5
              space-y-3
            ">


              {remixes.map((remix:any)=>(


                <button

                  key={remix.id}

                  onClick={()=>router.push(
                    `/rank/${remix.id}`
                  )}

                  className="
                    w-full
                    bg-white
                    text-black
                    rounded-xl
                    p-4
                    text-left
                    font-bold
                  "

                >

                  {remix.title}


                  <span className="
                    block
                    text-sm
                    text-gray-500
                    mt-1
                  ">

                    View perspective →

                  </span>


                </button>


              ))}


            </div>


          </div>









          <Link

            href="/explore"

            className="
              block
              bg-zinc-900
              rounded-3xl
              p-6
              hover:scale-105
              transition
            "

          >

            <h2 className="
              text-2xl
              font-black
            ">

              ⚡ Perspective Gap

            </h2>


            <p className="
              mt-3
              text-gray-400
            ">

              See where opinions differ most →

            </p>


          </Link>








          <Link

            href="/explore"

            className="
              block
              bg-zinc-900
              rounded-3xl
              p-6
              hover:scale-105
              transition
            "

          >

            <h2 className="
              text-2xl
              font-black
            ">

              🔥 Trending

            </h2>


            <p className="
              mt-3
              text-gray-400
            ">

              Discover active RANKDs →

            </p>


          </Link>








          <Link

            href="/explore"

            className="
              block
              bg-zinc-900
              rounded-3xl
              p-6
              hover:scale-105
              transition
            "

          >

            <h2 className="
              text-2xl
              font-black
            ">

              Explore Categories

            </h2>


            <p className="
              mt-3
              text-gray-400
            ">

              Find more Top 7 lists →

            </p>


          </Link>







        </aside>





      </div>


    </main>

  )

}