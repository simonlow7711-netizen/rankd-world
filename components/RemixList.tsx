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
      rankd-edition
      mt-8
      rounded-[28px]
      border
      border-black
      bg-[#F7F4EE]
      p-6
      text-center
      text-black
    ">

      <h2 className="
        text-2xl
        font-black
        tracking-[-0.04em]
      ">

        Different Perspectives

      </h2>





      <p className="
        mt-2
        text-black/50
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
                rounded-2xl
                border
                border-black
                bg-[#F7F4EE]
                p-5
                transition
                hover:bg-[#F7F4EE]
              "

            >


              <h3 className="
                font-black
              ">

                {remix.title}

              </h3>





              <p className="
                mt-2
                text-sm
                text-black/45
              ">

                Created by {remix.creator || "RANKD User"}

              </p>





              <div className="
                mt-4
                text-sm
                text-black/60
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
