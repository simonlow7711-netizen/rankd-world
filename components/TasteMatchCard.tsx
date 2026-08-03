"use client"

import Link from "next/link"





export default function TasteMatchCard({

  person

}:{

  person:any

}) {



  if(!person){

    return null

  }






  return (

    <Link

      href={`/profile/${person.username}`}

    >


      <div className="
        rankd-card
        p-6
        hover:-translate-y-1
        transition
      ">


        <p className="
          rankd-accent
          uppercase
          tracking-widest
          text-xs
          font-black
        ">

          Taste Match

        </p>





        <h3 className="
          text-2xl
          font-black
          mt-4
        ">

          {person.display_name || person.username}

        </h3>





        <p className="
          mt-3
          rankd-muted
        ">

          See how your opinions compare →

        </p>


      </div>


    </Link>

  )

}