"use client"

import { useEffect, useState } from "react"

export default function AdminPage() {

  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {

    const stored = JSON.parse(
      localStorage.getItem("rankdEvents") || "[]"
    )

    setEvents(stored)

  }, [])


  return (

    <main className="
      min-h-screen
      bg-black
      text-white
      p-8
    ">

      <h1 className="
        text-4xl
        font-black
      ">
        RANKD Analytics
      </h1>


      <div className="
        mt-8
        space-y-4
      ">

        {events.map((event,index)=>(

          <div
            key={index}
            className="
              bg-zinc-900
              rounded-xl
              p-4
            "
          >

            <p className="font-bold">
              {event.event}
            </p>

            <p className="text-gray-400 text-sm">
              {event.timestamp}
            </p>

          </div>

        ))}

      </div>

    </main>

  )

}