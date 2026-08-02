import Link from "next/link"



export default function Hero(){


  return (

    <section className="
      min-h-screen
      bg-[#F7F4EE]
      text-black
      flex
      flex-col
      justify-center
      items-center
      text-center
      px-6
      relative
      overflow-hidden
    ">



      <div className="
        absolute
        -top-10
        -right-10
        text-[220px]
        opacity-5
        font-black
        leading-none
      ">

        7

      </div>







      <p className="
        rankd-accent
        uppercase
        tracking-[0.35em]
        text-sm
        font-black
      ">

        The world's opinions, ranked

      </p>







      <h1 className="
        text-7xl
        md:text-[130px]
        font-black
        tracking-tight
        mt-6
        leading-none
      ">

        RANKD

      </h1>







      <h2 className="
        text-4xl
        md:text-7xl
        font-black
        mt-8
        max-w-5xl
        leading-[0.95]
      ">

        Everyone has an opinion.

        <br />

        Now rank it.

      </h2>







      <p className="
        max-w-2xl
        mt-8
        text-lg
        md:text-xl
        rankd-muted
        leading-relaxed
      ">

        Create your Top 7.
        Discover how the world thinks.
        Find the rankings that make you say:

        <br />

        <span className="
          font-black
          text-black
        ">

          "I'd rank it differently."

        </span>

      </p>







      <div className="
        flex
        gap-4
        mt-10
        flex-col
        md:flex-row
      ">





        <Link href="/create">

          <button className="
            rankd-button
            text-lg
          ">

            Create Your Top 7

          </button>

        </Link>







        <Link href="/explore">

          <button className="
            bg-white
            border
            border-black/10
            text-black
            px-8
            py-4
            rounded-full
            font-black
            text-lg
            hover:-translate-y-1
            transition
          ">

            Explore Perspectives

          </button>

        </Link>





      </div>





    </section>

  )

}