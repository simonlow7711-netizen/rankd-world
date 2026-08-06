"use client"

import {
  useRouter
} from "next/navigation"


import {
  TasteInsight
} from "@/utils/tasteInsights"

import {
  TasteGraphSignal
} from "@/utils/tasteGraph"

import {
  TasteIdentity
} from "@/utils/tasteIdentity"





type Props = {

  insight:TasteInsight

  signal:TasteGraphSignal

  identity:TasteIdentity

}









export default function TasteInsightCard({

  insight,

  signal,

  identity

}:Props){


  const router = useRouter()





  return (

    <section className="
      bg-black
      text-white
      rounded-[40px]
      p-8
      md:p-10
    ">


      <p className="
        uppercase
        tracking-[0.35em]
        text-xs
        font-black
        text-white/50
      ">

        Your Taste

      </p>







      <div className="
        mt-8
      ">


        <div className="
          text-5xl
          mb-4
        ">

          {identity.emoji}

        </div>





        <h2 className="
          text-4xl
          md:text-5xl
          font-black
          leading-tight
        ">

          {identity.title}

        </h2>



      </div>







      <p className="
        mt-6
        text-xl
        text-white/75
        leading-relaxed
        max-w-xl
      ">

        {identity.description}

      </p>







      <div className="
        mt-8
        pt-8
        border-t
        border-white/20
      ">


        <p className="
          text-sm
          uppercase
          tracking-widest
          font-black
          text-white/50
        ">

          Ranking Signal

        </p>





        <p className="
          mt-3
          text-lg
          text-white/80
        ">

          {signal.description}

        </p>


      </div>







      <div className="
        mt-8
        grid
        grid-cols-3
        gap-4
      ">



        <div>

          <p className="
            text-xs
            uppercase
            font-black
            text-white/40
          ">

            Unique

          </p>


          <p className="
            text-3xl
            font-black
            mt-1
          ">

            {signal.uniqueness}

          </p>


        </div>







        <div>

          <p className="
            text-xs
            uppercase
            font-black
            text-white/40
          ">

            Perspective

          </p>


          <p className="
            text-3xl
            font-black
            mt-1
          ">

            {signal.perspective}

          </p>


        </div>







        <div>

          <p className="
            text-xs
            uppercase
            font-black
            text-white/40
          ">

            Signal

          </p>


          <p className="
            text-3xl
            font-black
            mt-1
          ">

            {signal.confidence}

          </p>


        </div>


      </div>







      <button

        onClick={() =>
          router.push(
            "/explore?taste=similar"
          )
        }

        className="
          mt-10
          bg-white
          text-black
          px-8
          py-4
          rounded-full
          font-black
          text-lg
          hover:scale-105
          transition
        "

      >

        Discover Similar Taste →

      </button>





    </section>

  )

}