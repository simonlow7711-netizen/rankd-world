"use client"

import {
  calculateTasteDNA
} from "@/utils/tasteProfile"

import {
  calculateTasteMatch
} from "@/utils/tasteMatching"





type Props = {

  person:any

  rankings:any[]

}








export default function TasteMatchCard({

  person,

  rankings

}:Props){



  const currentTasteDNA =

    calculateTasteDNA(

      rankings

    )





  const personTasteDNA =

    calculateTasteDNA(

      person.rankings || []

    )








  const match =

    calculateTasteMatch(

      currentTasteDNA,

      personTasteDNA

    )







  return (

    <div className="
      rankd-card
      p-8
    ">





      <div className="
        flex
        items-center
        justify-between
        gap-4
      ">



        <div>

          <p className="
            rankd-accent
            uppercase
            tracking-widest
            text-sm
            font-black
          ">

            Taste Match

          </p>




          <h3 className="
            text-3xl
            font-black
            mt-3
          ">

            {person.displayName}

          </h3>



          <p className="
            rankd-muted
            mt-2
          ">

            @{person.username}

          </p>


        </div>







        <div className="
          w-24
          h-24
          rounded-full
          bg-black
          text-white
          flex
          items-center
          justify-center
          text-3xl
          font-black
          shrink-0
        ">

          {match.score}%

        </div>



      </div>







      <div className="
        mt-8
      ">


        <p className="
          text-xl
          font-black
        ">

          {match.label}

        </p>





        <p className="
          mt-3
          rankd-muted
        ">

          Based on your ranking behaviour and shared interests.

        </p>


      </div>







      {Object.keys(personTasteDNA).length > 0 && (

        <div className="
          mt-8
          pt-6
          border-t
          border-black/10
        ">



          <p className="
            font-black
            mb-3
          ">

            Their taste profile

          </p>





          <div className="
            flex
            flex-wrap
            gap-2
          ">



            {Object.keys(personTasteDNA)

              .slice(0,5)

              .map(category=>(


                <span

                  key={category}

                  className="
                    bg-[#F7F4EE]
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-bold
                  "

                >

                  {category}

                </span>


              ))}


          </div>


        </div>

      )}



    </div>

  )

}