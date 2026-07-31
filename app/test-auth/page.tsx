"use client"

import { useEffect, useState } from "react"

import { supabase } from "@/utils/supabase"


export default function TestAuthPage(){

  const [result,setResult] = useState("Checking...")


  useEffect(()=>{

    async function check(){

      const {
        data,
        error
      } = await supabase.auth.getSession()


      setResult(
        JSON.stringify(
          {
            session:data.session,
            error
          },
          null,
          2
        )
      )

    }


    check()

  },[])



  return (

    <main className="
      min-h-screen
      bg-black
      text-white
      p-10
    ">

      <pre>
        {result}
      </pre>

    </main>

  )

}