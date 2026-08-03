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
  trackEvent
} from "@/utils/analytics"


import {
  getSupabaseRanking
} from "@/utils/supabaseRankings"


import {
  supabase
} from "@/utils/supabase"


import ConversationTree from "@/components/ConversationTree"


import {
  buildConversationTree
} from "@/utils/conversationTree"








type RankClientProps = {

  id:string

}









export default function RankClient({

  id

}:RankClientProps){



  const router = useRouter()








  const [ranking,setRanking] =

    useState<any>(null)



  const [parentRanking,setParentRanking] =

    useState<any>(null)



  const [remixes,setRemixes] =

    useState<any[]>([])



  const [conversationTree,setConversationTree] =

    useState<any[]>([])



  const [loading,setLoading] =

    useState(true)









  useEffect(()=>{



    if(!id){

      return

    }







    async function load(){



      trackEvent(

        "ranking_viewed",

        {

          rankingId:id

        }

      )









      const current =

        await getSupabaseRanking(id)








      if(!current){



        setLoading(false)

        return


      }








      setRanking(current)








      if(current.parentId){



        const parent =

          await getSupabaseRanking(

            current.parentId

          )



        setParentRanking(parent)


      }









      const conversationRoot =

        current.rootId

        ||

        current.id







      const {

        data:conversationRankings

      } = await supabase

        .from("rankings")

        .select(

          "id,title,parent_id,root_id,created_at"

        )

        .eq(

          "root_id",

          conversationRoot

        )

        .order(

          "created_at",

          {

            ascending:false

          }

        )









      const tree =

        buildConversationTree(

          (conversationRankings ?? [])

          .map((item:any)=>(



            {

              id:item.id,

              title:item.title,

              parentId:item.parent_id,

              rootId:item.root_id

            }



          ))

        )








      setConversationTree(tree)









      const {

        data:childRankings

      } = await supabase

        .from("rankings")

        .select(

          "id,title,parent_id,root_id,created_at"

        )

        .eq(

          "root_id",

          conversationRoot

        )

        .neq(

          "id",

          current.id

        )

        .order(

          "created_at",

          {

            ascending:false

          }

        )








      setRemixes(

        (childRankings ?? [])

        .map((item:any)=>(



          {

            id:item.id,

            title:item.title,

            parentId:item.parent_id,

            rootId:item.root_id


          }



        ))

      )








      setLoading(false)



    }







    load()



  },[id])








  function rankIt(){



    if(!ranking){

      return

    }







    const items =

      ranking.items

      .map(

        (item:any)=>

          item.name

      )

      .join("|")








    router.push(

      `/create?title=${encodeURIComponent(

        ranking.title

      )}&items=${encodeURIComponent(

        items

      )}&originalId=${ranking.id}&rootId=${ranking.rootId || ranking.id}`

    )


  }








  if(loading){


    return (

      <main className="
        min-h-screen
        bg-[#F7F4EE]
        flex
        items-center
        justify-center
        text-black
        font-black
        text-2xl
      ">

        Loading RANKD...

      </main>

    )


  }








  if(!ranking){


    return (

      <main className="
        min-h-screen
        bg-[#F7F4EE]
        flex
        items-center
        justify-center
        font-black
      ">

        Ranking not found

      </main>

    )


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





        {parentRanking && (


          <div className="
            rankd-card
            p-6
            mb-8
          ">


            <p className="
              rankd-accent
              uppercase
              tracking-widest
              text-sm
              font-black
            ">

              Inspired by

            </p>




            <button

              onClick={()=>router.push(

                `/rank/${parentRanking.id}`

              )}

              className="
                mt-3
                text-2xl
                font-black
              "

            >

              {parentRanking.title} →

            </button>


          </div>


        )}







        {conversationTree.length > 0 && (


          <div className="mb-10">


            <ConversationTree

              nodes={conversationTree}

              currentId={ranking.id}

            />


          </div>


        )}







        <div className="
          grid
          lg:grid-cols-3
          gap-10
        ">





          <section className="
            lg:col-span-2
          ">



            <p className="
              rankd-accent
              uppercase
              tracking-widest
              text-sm
              font-black
            ">

              {ranking.category || "General"}

            </p>





            <h1 className="
              text-6xl
              md:text-8xl
              font-black
              leading-none
              mt-6
            ">

              {ranking.title}

            </h1>





            <p className="
              mt-6
              rankd-muted
              text-lg
            ">

              Created by {ranking.creator || "RANKD user"}

            </p>







            <div className="
              mt-10
              space-y-4
            ">


              {ranking.items.map((item:any)=>(


                <div

                  key={item.position}

                  className="
                    rankd-card
                    p-6
                    flex
                    items-center
                    gap-6
                  "

                >

                  <div className="
                    text-4xl
                    font-black
                    rankd-accent
                  ">

                    #{item.position}

                  </div>




                  <div className="
                    text-2xl
                    font-black
                  ">

                    {item.name}

                  </div>


                </div>


              ))}


            </div>







            <button

              onClick={rankIt}

              className="
                mt-10
                w-full
                rankd-button
                text-xl
              "

            >

              Would you rank it differently?

            </button>



          </section>







          <aside className="
            space-y-6
          ">



            <div className="
              rankd-card
              p-8
            ">


              <h2 className="
                text-3xl
                font-black
              ">

                Different Perspectives

              </h2>




              <p className="
                mt-4
                rankd-muted
              ">


                {remixes.length === 0

                ?

                "No alternative rankings yet."

                :

                `${remixes.length} people ranked this differently.`

                }


              </p>






              <div className="
                mt-6
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
                      bg-[#F7F4EE]
                      rounded-2xl
                      p-4
                      text-left
                      font-black
                    "

                  >

                    {remix.title}

                  </button>


                ))}


              </div>


            </div>







            <Link

              href="/explore"

              className="
                block
                rankd-card
                p-8
                hover:-translate-y-1
                transition
              "

            >

              <h2 className="
                text-2xl
                font-black
              ">

                Find another debate →

              </h2>




              <p className="
                mt-3
                rankd-muted
              ">

                Discover more opinions.

              </p>


            </Link>



          </aside>





        </div>





      </div>


    </main>

  )

}