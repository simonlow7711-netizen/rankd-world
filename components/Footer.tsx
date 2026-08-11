import Link from "next/link"


export default function Footer(){


  return (

    <footer className="
      bg-black
      text-white
      px-6
      py-20
    ">


      <div className="
        max-w-6xl
        mx-auto
      ">


        <div className="
          rounded-[40px]
          bg-zinc-900
          p-10
          md:p-14
          text-center
        ">


          <div className="
            text-7xl
            font-black
            opacity-20
          ">

            7

          </div>


          <h2 className="
            text-4xl
            md:text-6xl
            font-black
            -mt-8
          ">

            Everyone has a ranking.

          </h2>


          <p className="
            mt-5
            text-gray-400
            text-lg
            max-w-xl
            mx-auto
          ">

            Discover opinions.
            Create your Top 7.
            See where your perspective differs.

          </p>


          <Link

            href="/create"

            className="
              inline-block
              mt-8
              bg-white
              text-black
              px-8
              py-4
              rounded-full
              font-black
              hover:-translate-y-1
              transition
            "

          >

            Create Your RANKD →

          </Link>


        </div>


        <div className="
          mt-16
          flex
          flex-col
          md:flex-row
          justify-between
          gap-8
          items-center
        ">


          <div>


            <h3 className="
              text-4xl
              font-black
            ">

              RANKD

            </h3>


            <p className="
              mt-2
              text-gray-500
            ">

              The world's Top 7 everything.

            </p>


          </div>


          <div className="
            flex
            gap-8
            font-bold
          ">


            <Link

              href="/explore"

              className="
                hover:text-orange-400
                transition
              "

            >

              Explore

            </Link>


            <Link

              href="/create"

              className="
                hover:text-orange-400
                transition
              "

            >

              Create

            </Link>


            <Link

              href="/profile"

              className="
                hover:text-orange-400
                transition
              "

            >

              Profile

            </Link>


          </div>


        </div>


        <div className="
          mt-12
          pt-8
          border-t
          border-white/10
          text-center
          text-gray-500
          text-sm
        ">

          © {new Date().getFullYear()} RANKD.
          Built around human opinions.

        </div>


      </div>


    </footer>

  )

}