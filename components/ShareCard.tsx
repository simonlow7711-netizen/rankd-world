"use client"

type Props = {
  username:string
  rankings:any[]
}

export default function ShareCard({
  username,
  rankings
}:Props){

  return (
    <div className="
      bg-zinc-900
      rounded-3xl
      p-8
      mb-12
    ">
      <p className="
        text-gray-400
        text-sm
        uppercase
        font-bold
      ">
        Share your identity
      </p>

      <h2 className="
        text-4xl
        font-black
        mt-4
      ">
        @{username}'s RANKD
      </h2>

      <p className="
        mt-4
        text-gray-300
        text-lg
      ">
        Discover my Top 7 everything.
      </p>

      <div className="
        mt-8
      ">
        <div className="
          bg-black
          rounded-2xl
          p-5
        ">
          <p className="text-gray-400">
            RANKDs
          </p>

          <p className="
            text-3xl
            font-black
          ">
            {rankings.length}
          </p>
        </div>
      </div>

      <p className="
        mt-8
        text-xl
        font-bold
      ">
        What would your Top 7 be?
      </p>
    </div>
  )
}