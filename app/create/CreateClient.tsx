"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { trackEvent } from "@/utils/analytics"
import { supabase } from "@/utils/supabase"
import { getStoredUserId } from "@/utils/currentUser"



export default function Create() {


  const router = useRouter()

  const searchParams = useSearchParams()



  const [title, setTitle] = useState("")


  const [items, setItems] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ])



  const [originalId, setOriginalId] = useState("")


  const [preview, setPreview] = useState(false)


  const [message, setMessage] = useState("")





  useEffect(() => {


    const startingTitle =
      searchParams.get("title")


    const startingItems =
      searchParams.get("items")


    const startingOriginalId =
      searchParams.get("originalId")



    if(startingTitle){

      setTitle(startingTitle)

    }



    if(startingItems){


      const loadedItems =
        startingItems.split("|")



      setItems([

        ...loadedItems,

        "",
        "",
        "",
        "",
        "",
        "",
        ""

      ].slice(0,7))


    }



    if(startingOriginalId){

      setOriginalId(startingOriginalId)

    }



  },[searchParams])







  const slug = title

    .toLowerCase()

    .replace(/[^a-z0-9]+/g,"-")

    .replace(/(^-|-$)/g,"")





  const id = `${slug}-${Math.random()
    .toString(36)
    .substring(2,6)}`







  const ranking = {


    id,

    title,

    category:"General",

    creator:"",

    source:"community",

    createdAt:new Date().toISOString(),

    views:0,

    remixedFrom:
      originalId || undefined,

    originalId:
      originalId || undefined,


    description:
      "A new community RANKD.",


    items:

      items.map((item,index)=>(

        {
          position:index + 1,
          name:item,
          votes:0
        }

      ))

  }







  function createPreview(){



    if(!title.trim()){

      setMessage("Please add a title")

      return

    }




    if(items.some(item=>!item.trim())){

      setMessage(
        "Please complete all 7 rankings"
      )

      return

    }




    setMessage("")

    setPreview(true)


  }









  async function publishRankd(){



    const userId =
      getStoredUserId()



    if(!userId){


      setMessage(
        "Please create your RANKD identity first."
      )


      return

    }






    const { error: rankingError } =

      await supabase

        .from("rankings")

        .insert({

          id: ranking.id,

          user_id:userId,

          title:ranking.title,

          category:ranking.category,

          description:ranking.description,

          views:0

        })







    if(rankingError){


      console.error(rankingError)


      setMessage(
        rankingError.message
      )


      return

    }









    const rankingItems =

      ranking.items.map(item=>(


        {

          ranking_id:ranking.id,

          position:item.position,

          name:item.name,

          votes:item.votes

        }


      ))






    const { error:itemError } =

      await supabase

        .from("ranking_items")

        .insert(rankingItems)






    if(itemError){


      console.error(itemError)


      setMessage(
        itemError.message
      )


      return

    }








    trackEvent(

      "rankd_published",

      {

        rankingId:ranking.id

      }

    )





    router.push(
      `/rank/${id}`
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
        max-w-2xl
        mx-auto
      ">



        <h1 className="
          text-5xl
          font-black
        ">
          Create Your RANKD
        </h1>





        {!preview && (

          <>


            <p className="
              mt-4
              text-gray-400
            ">
              What is your Top 7?
            </p>





            <input

              className="
                mt-8
                w-full
                p-4
                rounded-xl
                bg-white
                text-black
              "

              placeholder="Top 7 of what?"

              value={title}

              onChange={
                e=>setTitle(e.target.value)
              }

            />





            <div className="
              mt-8
              space-y-3
            ">


              {items.map((item,index)=>(


                <input

                  key={index}

                  className="
                    w-full
                    p-4
                    rounded-xl
                    bg-white
                    text-black
                  "

                  placeholder={`#${index+1}`}

                  value={item}

                  onChange={e=>{


                    const updated=[...items]

                    updated[index]=e.target.value

                    setItems(updated)


                  }}

                />


              ))}


            </div>





            {message && (

              <p className="
                mt-6
                text-gray-300
                font-bold
              ">
                {message}
              </p>

            )}







            <button

              onClick={createPreview}

              className="
                mt-10
                bg-white
                text-black
                px-8
                py-4
                rounded-full
                font-black
              "

            >

              Preview RANKD

            </button>


          </>

        )}







        {preview && (

          <>


            <div className="
              mt-10
              bg-zinc-900
              rounded-3xl
              p-8
            ">


              <h2 className="
                text-3xl
                font-black
              ">

                {title}

              </h2>





              <div className="
                mt-6
                space-y-3
              ">


                {ranking.items.map(item=>(


                  <div

                    key={item.position}

                    className="
                      bg-white
                      text-black
                      rounded-xl
                      p-4
                      font-bold
                    "

                  >

                    #{item.position} {item.name}

                  </div>


                ))}


              </div>


            </div>





            <button

              onClick={publishRankd}

              className="
                mt-10
                bg-white
                text-black
                px-8
                py-4
                rounded-full
                font-black
              "

            >

              Publish RANKD

            </button>



          </>

        )}



      </div>


    </main>

  )

}