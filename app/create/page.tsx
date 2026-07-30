import { Suspense } from "react"
import CreateClient from "./CreateClient"


export default function CreatePage() {

  return (

    <Suspense
      fallback={
        <main className="
          min-h-screen
          bg-black
          text-white
          p-8
        ">
          Loading...
        </main>
      }
    >

      <CreateClient />

    </Suspense>

  )

}