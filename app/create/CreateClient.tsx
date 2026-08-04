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
  trackEvent
} from "@/utils/analytics"

import {
  supabase
} from "@/utils/supabase"

import SortableRankingList from "@/components/SortableRankingList"

import {
  RankingBuilderItem
} from "@/types/ranking"





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

    useState<RankingBuilderItem[]>([

      {
        id:crypto.randomUUID(),
        name:""
      },

      {
        id:crypto.randomUUID(),
        name:""
      },

      {
        id:crypto.randomUUID(),
        name:""
      },

      {
        id:crypto.randomUUID(),
        name:""
      },

      {
        id:crypto.randomUUID(),
        name:""
      },

      {
        id:crypto.randomUUID(),
        name:""
      },

      {
        id:crypto.randomUUID(),
        name:""
      }

    ])







  const [originalId,setOriginalId] =

    useState<string | null>(null)






  const [message,setMessage] =

    useState("")






  const [publishing,setPublishing] =

    useState(false)









  function createEmptyItems():RankingBuilderItem[]{


    return Array.from(

      {
        length:7
      },

      ()=>({

        id:crypto.randomUUID(),

        name:""

      })

    )


  }









  useEffect(()=>{


    trackEvent(

      "rank_started",

      {

        metadata:{

          source:"create_page",

          remix:

            !!searchParams.get(

              "originalId"

            )

        }

      }

    )






    const startingTitle =

      searchParams.get(

        "title"

      )






    const startingItems =

      searchParams.get(

        "items"

      )






    const startingOriginalId =

      searchParams.get(

        "originalId"

      )

      ||

      searchParams.get(

        "parentId"

      )







    if(startingTitle){


      setTitle(

        startingTitle

      )


    }







    if(startingItems){


      const loadedItems:RankingBuilderItem[] =

        startingItems

          .split("|")

          .map(

            value=>({

              id:

                crypto.randomUUID(),

              name:

                value

            })

          )



      setItems(

        [

          ...loadedItems,

          ...

          createEmptyItems()

        ]

        .slice(0,7)

      )


    }

    else{


      setItems(

        createEmptyItems()

      )


    }





    if(startingOriginalId){


      setOriginalId(

        startingOriginalId

      )


    }



  },[])


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







    if(

      items.some(

        item =>

          !item.name.trim()

      )

    ){


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

      .select(

        "id"

      )

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


      console.error(

        rankingError

      )



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

              item.name.trim(),



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


      console.error(

        itemError

      )



      setMessage(

        itemError.message

      )



      setPublishing(false)

      return


    }







    trackEvent(

      "rank_published",

      {

        rankingId,

        category,

        originalId,

        rootId:finalRootId,

        metadata:{

          source:"create_page",

          remix:

            !!originalId,

          itemCount:

            items.length

        }

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


          <h1 className="
            text-5xl
            font-black
            tracking-tight
          ">

            Create your RANKD

          </h1>



          <p className="
            mt-4
            rankd-muted
            text-lg
          ">

            Build your personal Top 7 and share your perspective.

          </p>


        </div>





        {originalId && (

          <div className="
            mt-8
            rankd-card
            p-5
            text-center
          ">


            <p className="
              font-black
              rankd-accent
            ">

              Remixing an existing RANKD

            </p>


            <p className="
              mt-2
              text-sm
              rankd-muted
            ">

              Create your own version and join the conversation.

            </p>


          </div>

        )}







        <div className="
          rankd-card
          mt-8
          p-8
        ">



          <label className="
            block
            font-black
            mb-3
          ">

            What are you ranking?

          </label>



          <input

            value={title}

            onChange={e =>

              setTitle(

                e.target.value

              )

            }

            placeholder="Example: Top 7 burgers in London"

            className="
              w-full
              rounded-xl
              border
              border-black/10
              px-5
              py-4
              text-lg
              font-bold
              bg-white
            "

          />






          <label className="
            block
            font-black
            mt-6
            mb-3
          ">

            Category

          </label>






          <div className="
            grid
            grid-cols-2
            sm:grid-cols-3
            gap-3
          ">



            {categories.map(

              item => (


                <button

                  key={item}

                  type="button"

                  onClick={() =>

                    setCategory(item)

                  }

                  className={

                    `
                    rounded-xl
                    border
                    px-4
                    py-3
                    font-black
                    transition
                    ${
                      category === item

                      ?

                      "bg-black text-white border-black"

                      :

                      "bg-white border-black/10 hover:border-black"

                    }
                    `

                  }

                >

                  {item}

                </button>


              )

            )}


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

            Drag your choices into the order you believe.

          </p>




          <p className="
            mt-3
            text-center
            text-sm
            font-black
            rankd-accent
          ">

            ☝️ Hold and drag items to reorder your Top 7

          </p>



          <div className="mt-8">


            <SortableRankingList

              items={items}

              setItems={setItems}

            />


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