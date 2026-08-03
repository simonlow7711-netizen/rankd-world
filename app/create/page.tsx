import { Suspense } from "react"

import CreateClient from "./CreateClient"





export const metadata = {

  title:
    "Create Your Top 7 | RANKD",

  description:
    "Create your own ranking and start the debate."

}





export default function CreatePage(){


  return (

    <Suspense

      fallback={

        <main className="
          min-h-screen
          bg-[#F7F4EE]
          flex
          items-center
          justify-center
          font-black
          text-2xl
        ">

          Loading RANKD creator...

        </main>

      }

    >

      <CreateClient />

    </Suspense>

  )


}