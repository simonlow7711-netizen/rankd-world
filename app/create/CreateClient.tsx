"use client"

import {
  useEffect,
  useRef,
  useState
} from "react"

import {
  useRouter,
  useSearchParams
} from "next/navigation"


import {
  Ranking,
  RankingBuilderItem
} from "@/types/ranking"


import {
  createSupabaseRanking
} from "@/utils/supabaseRankings"


import {
  supabase
} from "@/utils/supabase"


import SortableRankingList from "@/components/SortableRankingList"







const categories = [

  "Food & Drink",
  "Film & TV",
  "Music",
  "Sport",
  "Travel",
  "Technology",
  "Lifestyle",
  "General"

]








function createEmptyItems():RankingBuilderItem[]{


  return Array.from(

    {
      length:7
    },

    ()=>({

      id:

        crypto.randomUUID(),

      name:""

    })

  )


}









export default function CreateClient(){


  const router = useRouter()

  const searchParams = useSearchParams()







  const [title,setTitle] =

    useState("")







  const [category,setCategory] =

    useState("General")







  const [items,setItems] =

    useState<RankingBuilderItem[]>(

      createEmptyItems()

    )







  const [loading,setLoading] =

    useState(false)








  /*
    Remix lineage

    parentId:
    the ranking this was directly inspired by

    rootId:
    the original conversation family root
  */


  const parentIdRef =

    useRef<string | null>(null)





  const rootIdRef =

    useRef<string | null>(null)









  useEffect(()=>{


    const importedTitle =

      searchParams.get("title")





    const importedCategory =

      searchParams.get("category")





    const importedItems =

      searchParams.get("items")





    /*
      Support both:

      ?parentId=

      and older links:

      ?originalId=
    */


    const importedParentId =

      searchParams.get("parentId")

      ||

      searchParams.get("originalId")







    const importedRootId =

      searchParams.get("rootId")









    if(importedTitle){


      setTitle(

        importedTitle

      )


    }









    if(importedCategory){


      setCategory(

        importedCategory

      )


    }









    if(importedParentId){


      parentIdRef.current =

        importedParentId


    }









    if(importedRootId){


      rootIdRef.current =

        importedRootId


    }









    if(importedItems){



      const parsedItems =

        importedItems

        .split("|")

        .filter(

          item =>

            item.trim()

        )

        .map(

          item => ({

            id:

              crypto.randomUUID(),

            name:

              item.trim()

          })

        )









      const sevenItems = [

        ...parsedItems,

        ...Array(

          Math.max(

            0,

            7 - parsedItems.length

          )

        )

        .fill(null)

        .map(()=>({


          id:

            crypto.randomUUID(),

          name:""


        }))

      ]









      setItems(

        sevenItems.slice(

          0,

          7

        )

      )


    }



  },[searchParams])








  async function handlePublish(){


    if(!title.trim()){


      alert(

        "Add a title"

      )


      return


    }






    const cleanedItems =

      items

      .filter(

        item =>

          item.name.trim()

      )

      .map(

        item =>

          item.name.trim()

      )








    if(cleanedItems.length !== 7){


      alert(

        "Your RANKD needs exactly 7 items"

      )


      return


    }








    setLoading(true)








    const rankingId =

      crypto.randomUUID()







    const finalParentId =

      parentIdRef.current







    const finalRootId =

      rootIdRef.current

      ||

      finalParentId

      ||

      rankingId









    const ranking:Ranking = {


      id:

        rankingId,



      title:

        title.trim(),



      category,



      creator:

        "You",



      description:

        "",



      items:

        cleanedItems.map(

          (

            name,

            index

          )=>({


            position:

              index + 1,



            name,



            votes:

              0


          })

        ),



      createdAt:

        new Date().toISOString(),



      views:

        0,



      source:

        "community",



      parentId:

        finalParentId

        ||

        undefined,



      rootId:

        finalRootId

    }









    console.log(

      "CREATING RANKD",

      {

        id:

          ranking.id,


        parentId:

          ranking.parentId,


        rootId:

          ranking.rootId

      }

    )









    try {



      const {

        data:{

          user

        }


      } = await supabase.auth.getUser()







      if(user){



        await createSupabaseRanking(

          ranking,

          user.id

        )



      }

      else {



        const existing =

          JSON.parse(

            localStorage.getItem(

              "createdRankings"

            )

            ||

            "[]"

          )








        localStorage.setItem(

          "createdRankings",

          JSON.stringify(

            [

              ranking,

              ...existing

            ]

          )

        )


      }









      router.push(

        `/rank/${ranking.id}`

      )








    }

    catch(error){



      console.error(

        "CREATE RANKD ERROR",

        error

      )



      alert(

        "Something went wrong creating your RANKD"

      )



    }

    finally{



      setLoading(false)



    }


  }









  const inputClass = `

    w-full

    rounded-2xl

    p-5

    font-bold

    bg-[#F7F4EE]

    border

    border-black/10

    focus:outline-none

    focus:ring-2

    focus:ring-black

  `







  return (

    <main className="
      min-h-screen
      bg-[#F7F4EE]
      px-6
      py-16
      text-black
    ">


      <div className="
        max-w-3xl
        mx-auto
        bg-white
        rounded-[40px]
        p-8
        md:p-12
        shadow-sm
      ">


        <p className="
          rankd-accent
          uppercase
          tracking-[0.3em]
          text-sm
          font-black
        ">

          Create

        </p>





        <h1 className="
          text-5xl
          md:text-6xl
          font-black
          mt-4
          leading-none
        ">

          Create your Top 7

        </h1>





        <p className="
          mt-5
          text-xl
          text-gray-500
        ">

          Choose your 7. Share your opinion.

        </p>





        <div className="
          mt-10
          space-y-8
        ">



          <input

            value={title}

            onChange={e=>

              setTitle(

                e.target.value

              )

            }

            placeholder="Your RANKD title"

            className={

              `${inputClass} text-xl`

            }

          />









          <div className="
            space-y-3
          ">


            <p className="
              font-black
            ">

              Choose a category

            </p>





            <div className="
              flex
              flex-wrap
              gap-3
            ">


              {categories.map(

                option => (


                  <button

                    key={option}

                    type="button"

                    onClick={()=>setCategory(option)}

                    className={

                      `
                      px-5
                      py-3
                      rounded-full
                      font-black
                      transition
                      `

                      +

                      (

                        category === option

                        ?

                        `
                        bg-black
                        text-white
                        `

                        :

                        `
                        bg-[#F7F4EE]
                        border
                        border-black/10
                        `

                      )

                    }

                  >

                    {option}

                  </button>


                )

              )}


            </div>


          </div>









          <div className="
            space-y-4
          ">


            <p className="
              font-black
            ">

              Rank your 7

            </p>





            <SortableRankingList

              items={items}

              setItems={setItems}

            />


          </div>









          <button

            onClick={handlePublish}

            disabled={loading}

            className="
              w-full
              bg-black
              text-white
              rounded-full
              py-5
              text-xl
              font-black
              hover:scale-[1.02]
              transition
            "

          >

            {loading

              ?

              "Creating..."

              :

              "Publish RANKD →"

            }


          </button>





        </div>


      </div>


    </main>


  )


}