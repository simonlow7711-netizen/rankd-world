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
    <div
      className="
        rankd-edition
        mb-12
        rounded-[28px]
        border
        border-black
        bg-[#F7F4EE]
        p-8
        text-center
        text-black
      "
    >
      <p className="
        text-[11px]
        font-black
        uppercase
        tracking-[0.22em]
        text-[#FF6B35]
      ">
        Share your identity
      </p>

      <h2 className="
        mt-4
        text-4xl
        font-black
        tracking-[-0.04em]
      ">
        @{username}'s RANKD
      </h2>

      <p className="
        mx-auto
        mt-4
        max-w-md
        text-lg
        leading-relaxed
        text-black/50
      ">
        Discover my Top 7 everything.
      </p>

      <div className="
        mx-auto
        mt-8
        max-w-xs
        rounded-2xl
        border
        border-black
        bg-[#F7F4EE]
        p-5
      ">
        <p className="
          text-[10px]
          font-black
          uppercase
          tracking-[0.18em]
          text-black/40
        ">
          RANKDs
        </p>

        <p className="
          mt-2
          text-3xl
          font-black
        ">
          {rankings.length}
        </p>
      </div>

      <p className="
        mt-8
        text-xl
        font-black
      ">
        What would your Top 7 be?
      </p>
    </div>
  )
}
