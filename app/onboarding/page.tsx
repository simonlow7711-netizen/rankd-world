"use client"


import { useState } from "react"

import { supabase } from "@/utils/supabase"

import { setStoredUserId } from "@/utils/currentUser"

import { useRouter } from "next/navigation"





export default function Onboarding(){


  const router = useRouter()


  const [username,setUsername] =
    useState("")


  const [displayName,setDisplayName] =
    useState("")


  const [error,setError] =
    useState("")





  async function createProfile(){


    setError("")



    const cleanUsername =

      username
        .toLowerCase()
        .replace(/\s/g,"")




    const {

      data,

      error

    } = await supabase

      .from("profiles")

      .insert({

        username:
          cleanUsername,

        display_name:
          displayName

      })

      .select()

      .single()





    if(error){

      setError(
        error.message
      )

      return

    }





    setStoredUserId(

      data.id

    )





    router.push("/profile")


  }







  return (

    <main className="
      min-h-screen
      bg-black
      text-white
      flex
      items-center
      justify-center
      px-6
    ">


      <div className="
        max-w-md
        w-full
      ">


        <h1 className="
          text-5xl
          font-black
        ">

          Welcome to RANKD

        </h1>



        <p className="
          text-gray-400
          mt-4
        ">

          Create your identity and start ranking.

        </p>





        <input

          placeholder="Username"

          value={username}

          onChange={e=>setUsername(e.target.value)}

          className="
            mt-8
            w-full
            bg-zinc-900
            rounded-xl
            p-4
          "

        />





        <input

          placeholder="Display name"

          value={displayName}

          onChange={e=>setDisplayName(e.target.value)}

          className="
            mt-4
            w-full
            bg-zinc-900
            rounded-xl
            p-4
          "

        />





        <button

          onClick={createProfile}

          className="
            mt-6
            w-full
            bg-white
            text-black
            rounded-full
            py-4
            font-black
          "

        >

          Create Identity →

        </button>





        {

          error &&

          <p className="
            text-red-400
            mt-4
          ">

            {error}

          </p>

        }



      </div>


    </main>

  )


}