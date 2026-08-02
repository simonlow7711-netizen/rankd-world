import { Suspense } from "react"

import CreateClient from "./CreateClient"



export default function CreatePage() {


  return (

    <Suspense

      fallback={

        <main className="
          min-h-screen
          bg-[#F7F4EE]
          text-black
          flex
          flex-col
          items-center
          justify-center
          px-6
          text-center
        ">


          <p className="
            rankd-accent
            uppercase
            tracking-[0.3em]
            text-sm
            font-black
          ">

            RANKD

          </p>





          <h1 className="
            text-5xl
            font-black
            mt-6
          ">

            Creating your RANKD...

          </h1>





          <p className="
            mt-4
            rankd-muted
            text-lg
          ">

            Preparing your opinion.

          </p>


        </main>

      }

    >

      <CreateClient />

    </Suspense>

  )

}