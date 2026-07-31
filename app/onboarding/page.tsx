"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { supabase } from "@/utils/supabase"



export default function OnboardingPage(){


  const router = useRouter()


  const [displayName,setDisplayName] =
    useState("")


  const [username,setUsername] =
    useState("")


  const [message,setMessage] =
    useState("")


  const [loading,setLoading] =
    useState(false)





  async function createProfile(){


    setMessage("")



    const cleanUsername =
      username
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g,"")





    if(!displayName.trim()){


      setMessage(
        "Please add your name"
      )


      return

    }





    if(cleanUsername.length < 3){


      setMessage(
        "Username must be at least 3 characters"
      )


      return

    }






    setLoading(true)






    /*
      Get existing user.
      If none exists, create anonymous account.
    */


    let {

      data:{
        user

      }

    } = await supabase.auth.getUser()






    if(!user){



      const {

        data,
        error

      } = await supabase.auth.signInAnonymously()






      if(error){


        console.error(
          "AUTH ERROR:",
          error
        )


        setMessage(
          error.message
        )


        setLoading(false)


        return

      }




      user = data.user



    }








    if(!user){


      setMessage(
        "Unable to create account"
      )


      setLoading(false)


      return

    }








    /*
      Check username availability
    */


    const {

      data:existing,
      error:existingError

    } = await supabase

      .from("profiles")

      .select("id")

      .eq(
        "username",
        cleanUsername
      )

      .maybeSingle()






    if(existingError){


      console.error(
        existingError
      )


      setMessage(
        existingError.message
      )


      setLoading(false)


      return

    }








    if(existing){


      setMessage(
        "Username already taken"
      )


      setLoading(false)


      return

    }








    /*
      Create profile
    */


    const {

      error

    } = await supabase

      .from("profiles")

      .upsert({

        id:user.id,

        username:cleanUsername,

        display_name:
          displayName.trim()

      })







    if(error){


      console.error(
        "PROFILE ERROR:",
        error
      )


      setMessage(
        error.message
      )


      setLoading(false)


      return

    }








    router.push("/explore")


  }









  return (

    <main className="
      min-h-screen
      bg-black
      text-white
      px-6
      py-20
    ">


      <div className="
        max-w-xl
        mx-auto
      ">


        <h1 className="
          text-5xl
          font-black
        ">

          Create your RANKD identity

        </h1>





        <p className="
          mt-4
          text-gray-400
        ">

          Your rankings become your taste profile.

        </p>






        <input

          className="
            mt-10
            w-full
            p-4
            rounded-xl
            bg-white
            text-black
            placeholder-gray-500
            outline-none
          "

          placeholder="Display name"

          value={displayName}

          onChange={
            e=>setDisplayName(e.target.value)
          }

        />







        <input

          className="
            mt-4
            w-full
            p-4
            rounded-xl
            bg-white
            text-black
            placeholder-gray-500
            outline-none
          "

          placeholder="Username"

          value={username}

          onChange={
            e=>setUsername(e.target.value)
          }

        />








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

          onClick={createProfile}

          disabled={loading}

          className="
            mt-8
            bg-white
            text-black
            px-8
            py-4
            rounded-full
            font-black
          "

        >

          {loading
            ? "Creating..."
            : "Create Identity →"
          }


        </button>






      </div>


    </main>

  )


}