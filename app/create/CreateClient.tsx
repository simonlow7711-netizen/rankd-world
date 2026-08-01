"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

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

      setTitle(
        startingTitle
      )

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

        ].slice(0,7)

      )


    }







    if(startingOriginalId){

      setOriginalId(
        startingOriginalId
      )

    }





  },[searchParams])












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
    "Publishing..."
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

    } = await supabase.auth.signInAnonymously()





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
        ? "A community remix of another RANKD."
        : "A new community RANKD.",


      views:0,


      parent_id:
        originalId ?? null,


      source_type:
        originalId
        ? "remix"
        : "community"


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

    .insert(rankingItems)








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

    "rankd_published",

    {

      rankingId,

      originalId

    }

  )








  setMessage(
    "Your RANKD has been published successfully 🎉"
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





{originalId && (

<div className="
mt-6
bg-zinc-900
rounded-3xl
p-5
">


<p className="
font-bold
">

🔥 You are creating a remix

</p>


<p className="
text-gray-400
mt-2
">

Your ranking will be linked to the original RANKD.

</p>


</div>

)}







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
flex
flex-wrap
gap-3
">


{categories.map(item=>(


<button

key={item}

onClick={()=>setCategory(item)}

className={`
px-4
py-3
rounded-full
font-bold
${
category===item
?"bg-white text-black"
:"bg-zinc-800 text-white"
}
`}

>

{item}

</button>


))}


</div>









<div className="
mt-10
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
font-bold
text-gray-300
">

{message}

</p>

)}









<button

onClick={publishRankd}

disabled={publishing}

className="
mt-10
bg-white
text-black
px-8
py-4
rounded-full
font-black
disabled:opacity-50
"

>

{publishing
?
"Publishing..."
:
"Publish RANKD →"
}

</button>






</div>


</main>

)



}