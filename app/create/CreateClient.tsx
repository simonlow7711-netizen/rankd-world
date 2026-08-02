"use client"

import { useEffect, useState } from "react"

import {
  useRouter,
  useSearchParams
} from "next/navigation"


import { trackEvent } from "@/utils/analytics"

import { supabase } from "@/utils/supabase"







const categories = [

  "Food & Drink",
  "Film & TV",
  "Music",
  "Sport",
  "Travel",
  "Gaming",
  "Books",
  "Technology",
  "Places",
  "Lifestyle",
  "Entertainment",
  "Business",
  "Art & Design",
  "Education",
  "Science",
  "General"

]









export default function CreateClient(){



  const router = useRouter()

  const searchParams = useSearchParams()







  const [title,setTitle] =
    useState("")



  const [category,setCategory] =
    useState("")



  const [items,setItems] =
    useState([

      "",
      "",
      "",
      "",
      "",
      "",
      ""

    ])





  const [originalId,setOriginalId] =
    useState<string | null>(null)



  const [message,setMessage] =
    useState("")



  const [publishing,setPublishing] =
    useState(false)









  useEffect(()=>{



    const startingTitle =
      searchParams.get("title")



    const startingItems =
      searchParams.get("items")



    const startingOriginalId =

      searchParams.get("originalId")

      ||

      searchParams.get("parentId")







    if(startingTitle){

      setTitle(startingTitle)

    }







    if(startingItems){


      const loaded =

        startingItems.split("|")



      setItems(

        [

          ...loaded,

          "",
          "",
          "",
          "",
          "",
          "",
          ""

        ]

        .slice(0,7)

      )


    }







    if(startingOriginalId){


      setOriginalId(

        startingOriginalId

      )


    }





  },[searchParams])













  async function getConversationRoot(

    parentId:string

  ){



    let currentId = parentId





    while(currentId){



      const {

        data:parent,

        error

      } = await supabase

        .from("rankings")

        .select(

          "id,parent_id,root_id"

        )

        .eq(

          "id",

          currentId

        )

        .single()





      if(error || !parent){

        break

      }





      if(parent.root_id){

        return parent.root_id

      }





      if(!parent.parent_id){

        return parent.id

      }





      currentId =

        parent.parent_id


    }





    return parentId


  }













  async function publishRankd(){



    if(publishing){

      return

    }





    setPublishing(true)







    if(!title.trim()){


      setMessage(
        "Please add a title"
      )


      setPublishing(false)

      return

    }







    if(!category){


      setMessage(
        "Please choose a category"
      )


      setPublishing(false)

      return

    }







    if(items.some(item=>!item.trim())){


      setMessage(
        "Please complete all 7 rankings"
      )


      setPublishing(false)

      return

    }







    setMessage(

      "Creating your perspective..."

    )







    const rankingId =

      crypto.randomUUID()







    const {

      data:{

        user

      }

    } = await supabase.auth.getUser()







    let userId =

      user?.id







    if(!userId){



      const {

        data,

        error

      } = await supabase.auth

        .signInAnonymously()





      if(error){


        setMessage(
          error.message
        )


        setPublishing(false)

        return


      }







      userId =

        data.user?.id



    }







    if(!userId){


      setMessage(

        "Unable to create user"

      )


      setPublishing(false)

      return


    }









    const {

      data:existingProfile

    } = await supabase

      .from("profiles")

      .select("id")

      .eq(

        "id",

        userId

      )

      .maybeSingle()








    if(!existingProfile){



      await supabase

        .from("profiles")

        .insert({

          id:userId,

          username:

            `user-${userId.substring(0,6)}`,

          display_name:

            "RANKD User"

        })


    }









    let finalRootId =

      rankingId







    if(originalId){



      finalRootId =

        await getConversationRoot(

          originalId

        )


    }
        const {

      error:rankingError

    } = await supabase

      .from("rankings")

      .insert({

        id:rankingId,

        user_id:userId,

        title:title.trim(),

        category,

        description:

          originalId

          ?

          "A community remix of another RANKD."

          :

          "A new community RANKD.",


        views:0,


        parent_id:

          originalId ?? null,


        root_id:

          finalRootId,


        source_type:

          originalId

          ?

          "remix"

          :

          "community"


      })








    if(rankingError){


      console.error(rankingError)


      setMessage(

        rankingError.message

      )


      setPublishing(false)

      return


    }









    const rankingItems =


      items.map(

        (item,index)=>(


          {

            ranking_id:

              rankingId,


            position:

              index + 1,


            name:

              item.trim(),


            votes:

              0


          }


        )

      )









    const {

      error:itemError

    } = await supabase

      .from("ranking_items")

      .insert(

        rankingItems

      )








    if(itemError){


      console.error(itemError)


      setMessage(

        itemError.message

      )


      setPublishing(false)

      return


    }









    trackEvent(

      "rankd_published",

      {

        rankingId,

        originalId,

        rootId:finalRootId

      }

    )









    setMessage(

      "Your perspective is live 🎉"

    )









    setTimeout(()=>{


      router.push(

        `/rank/${rankingId}`

      )


    },1200)



  }














  return (

    <main className="
      min-h-screen
      bg-[#F7F4EE]
      text-black
      px-6
      py-16
    ">


      <div className="
        max-w-3xl
        mx-auto
      ">







        <div className="
          text-center
        ">



          <p className="
            rankd-accent
            uppercase
            tracking-[0.3em]
            text-sm
            font-black
          ">

            Your opinion matters

          </p>






          <h1 className="
            text-6xl
            md:text-8xl
            font-black
            leading-none
            mt-6
          ">

            Create
            <br />
            Your Top 7

          </h1>






          <p className="
            mt-6
            text-xl
            rankd-muted
          ">

            Decide what deserves the top spot.

          </p>


        </div>









        {originalId && (


          <div className="
            rankd-card
            mt-10
            p-6
            text-center
          ">


            <p className="
              rankd-accent
              font-black
              uppercase
              tracking-widest
            ">

              Remix

            </p>



            <p className="
              mt-3
              font-bold
            ">

              Your ranking joins an existing conversation.

            </p>


          </div>


        )}









        <div className="
          rankd-card
          mt-12
          p-8
        ">


          <h2 className="
            text-2xl
            font-black
          ">

            What are you ranking?

          </h2>




          <input

            className="
              mt-6
              w-full
              p-5
              rounded-2xl
              bg-[#F7F4EE]
              text-xl
              font-bold
              outline-none
            "

            placeholder="Top 7 of what?"

            value={title}

            onChange={e=>

              setTitle(

                e.target.value

              )

            }

          />


        </div>









        <div className="
          rankd-card
          mt-8
          p-8
        ">


          <h2 className="
            text-2xl
            font-black
          ">

            Choose a category

          </h2>





          <div className="
            mt-6
            flex
            flex-wrap
            justify-center
            gap-3
          ">


            {categories.map(item=>(


              <button

                key={item}

                onClick={()=>setCategory(item)}

                className={`

                  px-5
                  py-3
                  rounded-full
                  font-black
                  transition

                  ${
                    category===item

                    ?

                    "bg-black text-white"

                    :

                    "bg-[#F7F4EE]"

                  }

                `}

              >

                {item}

              </button>


            ))}


          </div>


        </div>









        <div className="
          rankd-card
          mt-8
          p-8
        ">


          <h2 className="
            text-3xl
            font-black
            text-center
          ">

            Your Top 7

          </h2>




          <p className="
            mt-2
            text-center
            rankd-muted
          ">

            Put your choices in order.

          </p>







          <div className="
            mt-8
            space-y-4
          ">


            {items.map((item,index)=>(



              <div

                key={index}

                className="
                  flex
                  items-center
                  gap-4
                "

              >



                <div className="
                  w-12
                  h-12
                  rounded-full
                  bg-black
                  text-white
                  flex
                  items-center
                  justify-center
                  font-black
                ">

                  {index + 1}

                </div>







                <input

                  className="
                    flex-1
                    p-5
                    rounded-2xl
                    bg-[#F7F4EE]
                    font-bold
                    outline-none
                  "

                  placeholder={`Choice ${index+1}`}

                  value={item}

                  onChange={e=>{


                    const updated =

                      [...items]


                    updated[index] =

                      e.target.value


                    setItems(updated)


                  }}

                />


              </div>


            ))}


          </div>


        </div>









        {message && (


          <p className="
            mt-8
            text-center
            font-black
          ">

            {message}

          </p>


        )}









        <button

          onClick={publishRankd}

          disabled={publishing}

          className="
            mt-10
            w-full
            rankd-button
            text-xl
            py-6
            disabled:opacity-50
          "

        >


          {publishing

          ?

          "Creating your RANKD..."

          :

          "Publish your perspective →"

          }


        </button>








        <p className="
          mt-6
          text-center
          rankd-muted
          text-sm
        ">

          Your ranking becomes part of the conversation.

        </p>






      </div>


    </main>

  )


}