"use client"

import {
  useEffect,
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









export default function CreateClient(){


  const router = useRouter()

  const searchParams = useSearchParams()





  const [title,setTitle] =

    useState("")



  const [category,setCategory] =

    useState("General")



  const [items,setItems] =

    useState<RankingBuilderItem[]>([

      {
        id: crypto.randomUUID(),
        name:""
      },

      {
        id: crypto.randomUUID(),
        name:""
      },

      {
        id: crypto.randomUUID(),
        name:""
      },

      {
        id: crypto.randomUUID(),
        name:""
      },

      {
        id: crypto.randomUUID(),
        name:""
      },

      {
        id: crypto.randomUUID(),
        name:""
      },

      {
        id: crypto.randomUUID(),
        name:""
      }

    ])





  const [loading,setLoading] =

    useState(false)









  useEffect(()=>{


    const dailyTitle =

      searchParams.get("title")



    const dailyCategory =

      searchParams.get("category")





    if(dailyTitle){

      setTitle(

        dailyTitle

      )

    }





    if(dailyCategory){

      setCategory(

        dailyCategory

      )

    }



  },[searchParams])
    async function handlePublish(){


    if(

      !title.trim()

    ){

      alert(

        "Add a title"

      )

      return

    }





    const cleanedItems =

      items.filter(

        item =>

          item.name.trim()

      )





    if(

      cleanedItems.length !== 7

    ){

      alert(

        "Your RANKD needs exactly 7 items"

      )

      return

    }





    setLoading(true)









    const ranking:Ranking = {


      id:

        crypto.randomUUID(),



      title:

        title,



      category:

        category,



      creator:

        "You",



      description:

        "",



      items:

        cleanedItems.map(

          (

            item,

            index

          ) => ({


            position:

              index + 1,



            name:

              item.name,



            votes:

              0


          })

        ),



      createdAt:

        new Date().toISOString(),



      views:

        0,



      source:

        "community"


    }









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

          JSON.stringify([

            ranking,

            ...existing

          ])

        )


      }







      router.push(

        `/rank/${ranking.id}`

      )



    }

    catch(error){


      console.error(

        error

      )


      alert(

        "Something went wrong creating your RANKD"

      )


    }

    finally {


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

            onChange={e =>

              setTitle(

                e.target.value

              )

            }

            placeholder="Your RANKD title"

            className={`

              ${inputClass}

              text-xl

            `}

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

                    onClick={() =>

                      setCategory(

                        option

                      )

                    }

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