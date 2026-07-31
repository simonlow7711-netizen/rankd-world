"use client"


import { useEffect } from "react"

import { supabase } from "@/utils/supabase"





export default function SupabaseTest(){



  useEffect(()=>{



    async function test(){



      const {

        data,

        error


      } = await supabase


        .from("profiles")


        .select("*")





      console.log(

        "SUPABASE DATA",

        data

      )





      console.log(

        "SUPABASE ERROR",

        error

      )



    }





    test()



  },[])







  return (


    <main className="

      min-h-screen

      bg-black

      text-white

      p-10

    ">


      <h1 className="

        text-4xl

        font-black

      ">

        Supabase Connected Test

      </h1>


      <p className="mt-4 text-gray-400">

        Check browser console

      </p>


    </main>


  )


}