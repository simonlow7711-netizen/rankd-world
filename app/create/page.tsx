"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"


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



  const [preview, setPreview] = useState(false)


  const [message, setMessage] = useState("")





  useEffect(() => {


    const startingTitle = searchParams.get("title")

    const startingItems = searchParams.get("items")



    if (startingTitle) {

      setTitle(startingTitle)

    }



    if (startingItems) {

      const loadedItems = startingItems.split("|")


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



  }, [searchParams])







  const id = title

    .toLowerCase()

    .replace(/[^a-z0-9]+/g, "-")

    .replace(/(^-|-$)/g, "")



  const ranking = {


    id,


    title,


    category: "General",


    creator: "Simon",


    source: "community",


    createdAt: new Date().toISOString(),


    views: 0,


    description:
      "A new community RANKD.",


    items: items.map((item,index)=>(


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

      setMessage("Please complete all 7 rankings")

      return

    }



    setMessage("")

    setPreview(true)


  }







  function publishRankd(){


    const existingRankings = JSON.parse(

      localStorage.getItem("createdRankings") || "[]"

    )



    localStorage.setItem(

      "createdRankings",

      JSON.stringify([

        ...existingRankings,

        ranking

      ])

    )



    router.push(`/rank/${id}`)


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
                placeholder:text-gray-500
              "


              placeholder="Top 7 of what?"


              value={title}


              onChange={(e)=>setTitle(e.target.value)}


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
                    placeholder:text-gray-500
                  "


                  placeholder={`#${index + 1}`}


                  value={item}


                  onChange={(e)=>{


                    const updatedItems=[...items]


                    updatedItems[index]=e.target.value


                    setItems(updatedItems)


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