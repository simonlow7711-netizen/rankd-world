"use client"

import Link from "next/link"


interface RemixListProps {

  remixes:any[]

}



export default function RemixList({

  remixes

}:RemixListProps){


  if(!remixes || remixes.length === 0){

    return null

  }





  return (

    <div className="
      mt-8
      bg-zinc-900
      rounded-3xl
      p-6
    ">


      <h2 className="
        text-2xl
        font-black
      ">

        Different Perspectives

      </h2>






      <p className="
        mt-2
        text-gray-400
      ">

        Everyone has their own Top 7.

      </p>






      <div className="
        mt-6
        space-y-4
      ">


        {remixes.map((remix)=>(


          <Link

            key={remix.id}

            href={`/rank/${remix.id}`}

          >


            <div

              className="
                bg-black
                rounded-2xl
                p-5
                hover:scale-[1.02]
                transition
              "

            >


              <h3 className="
                font-black
              ">

                {remix.title}

              </h3>





              <p className="
                mt-2
                text-gray-400
                text-sm
              ">

                Created by {remix.creator || "RANKD User"}

              </p>





              <div className="
                mt-4
                text-sm
                text-gray-300
              ">


                {remix.items
                  ?.slice(0,3)
                  .map(
                    (item:any)=>(

                    <div key={item.position}>

                      #{item.position} {item.name}

                    </div>

                  ))}



              </div>


            </div>


          </Link>


        ))}


      </div>


    </div>

  )

}