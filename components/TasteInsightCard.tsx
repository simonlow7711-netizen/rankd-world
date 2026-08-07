"use client"

import {
  TasteGraphSignal
} from "@/utils/tasteGraphSignal"

import {
  TasteInsight
} from "@/utils/tasteInsights"

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



  return (

    <section className="
      rankd-card
      p-8
    ">





      <p className="
        rankd-accent
        uppercase
        tracking-widest
        text-xs
        font-black
      ">

        Taste Graph

      </p>







      <h2 className="
        text-4xl
        font-black
        mt-4
      ">

        Your taste signal

      </h2>







      <p className="
        mt-4
        rankd-muted
        text-lg
      ">

        Every ranking you create teaches RANKD
        more about individual taste.

      </p>







      <div className="
        mt-8
        grid
        md:grid-cols-3
        gap-5
      ">


        <Metric

          label="Uniqueness"

          value={`${signal.uniqueness}%`}

        />





        <Metric

          label="Perspective"

          value={`${signal.perspective}%`}

        />





        <Metric

          label="Confidence"

          value={`${signal.confidence}%`}

        />



      </div>







      <div className="
        mt-8
        bg-[#F7F4EE]
        rounded-3xl
        p-6
      ">


        <p className="
          text-xl
          font-black
        ">

          {signal.description}

        </p>


      </div>







      <div className="
        mt-10
        border-t
        border-black/10
        pt-8
      ">


        <p className="
          rankd-accent
          uppercase
          tracking-widest
          text-xs
          font-black
        ">

          Taste Identity

        </p>





        <h3 className="
          text-3xl
          font-black
          mt-3
        ">

          {identity.title}

        </h3>





        <p className="
          mt-4
          rankd-muted
        ">

          {identity.description}

        </p>


      </div>







      <div className="
        mt-10
      ">


        <p className="
          rankd-accent
          uppercase
          tracking-widest
          text-xs
          font-black
        ">

          Insight

        </p>





        <p className="
          mt-3
          text-xl
          font-black
        ">

          {insight.description}

        </p>



      </div>






    </section>

  )

}









function Metric({

  label,

  value

}:{

  label:string

  value:string

}){


  return (

    <div className="
      bg-white
      rounded-2xl
      p-5
    ">


      <p className="
        rankd-muted
        font-bold
      ">

        {label}

      </p>




      <p className="
        text-3xl
        font-black
        mt-2
      ">

        {value}

      </p>



    </div>

  )

}