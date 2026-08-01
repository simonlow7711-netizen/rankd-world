import Link from "next/link"


export default function Trending() {


  return (

    <section className="
      bg-black
      text-white
      px-6
      py-20
    ">


      <div className="
        max-w-6xl
        mx-auto
      ">


        <h2 className="
          text-4xl
          font-black
          mb-10
        ">

          🔥 Trending Today

        </h2>





        <div className="
          bg-zinc-900
          rounded-3xl
          p-8
        ">


          <p className="
            text-gray-400
          ">

            Trending RANKDs are coming soon.

          </p>


          <Link

            href="/explore"

            className="
              inline-block
              mt-6
              bg-white
              text-black
              px-6
              py-3
              rounded-full
              font-black
            "

          >

            Explore RANKDs →

          </Link>


        </div>


      </div>


    </section>

  )

}