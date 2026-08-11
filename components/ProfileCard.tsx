"use client"

import {
  useState
} from "react"



export default function ProfileCard({

  username,

  rankings,

  achievements

}:any){



  const [copied,setCopied] =

    useState(false)





  async function shareProfile(){


    const url =

      `${window.location.origin}/profile/${username}`



    const shareText =

      `Check out my RANKD — my Top 7 everything.`






    const isMobile =

      /Android|iPhone|iPad/i.test(

        navigator.userAgent

      )







    if(

      navigator.share &&

      isMobile

    ){


      try{


        await navigator.share({

          title:
            `${username}'s RANKD`,

          text:
            shareText,

          url

        })


      }

      catch{

        return

      }


    }






    else{


      await navigator.clipboard.writeText(

        `${shareText} ${url}`

      )



      setCopied(true)



      setTimeout(()=>{


        setCopied(false)


      },2000)



    }


  }









  return (

    <div

      className="
        bg-white
        text-black
        rounded-3xl
        p-8
        mb-12
      "

    >





      <h2

        className="
          text-4xl
          font-black
        "

      >

        @{username}

      </h2>







      <p

        className="
          mt-3
          text-gray-600
        "

      >

        My RANKD identity

      </p>








      <div

        className="
          mt-8
          grid
          grid-cols-2
          gap-4
        "

      >






        <div

          className="
            bg-black
            text-white
            rounded-2xl
            p-5
          "

        >

          <p className="text-gray-400">

            RANKDs

          </p>



          <p

            className="
              text-3xl
              font-black
            "

          >

            {rankings.length}

          </p>



        </div>








        <div

          className="
            bg-black
            text-white
            rounded-2xl
            p-5
          "

        >

          <p className="text-gray-400">

            Achievements

          </p>



          <p

            className="
              text-3xl
              font-black
            "

          >

            {achievements.length}

          </p>



        </div>







      </div>








      <button


        onClick={shareProfile}


        className="
          mt-8
          bg-black
          text-white
          px-8
          py-4
          rounded-full
          font-black
          hover:scale-105
          transition
        "


      >


        {copied

          ? "Copied ✓"

          : "Share My RANKD →"

        }



      </button>






    </div>


  )

}