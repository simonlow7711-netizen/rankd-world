import Link from "next/link"



export default function Navbar(){


  return (

    <nav className="
      sticky
      top-0
      z-50
      bg-[#F7F4EE]/90
      backdrop-blur-md
      px-4
      md:px-8
      py-4
    ">


      <div className="
        max-w-7xl
        mx-auto
        bg-white
        border
        border-black/5
        rounded-full
        px-5
        md:px-8
        py-4
        flex
        justify-between
        items-center
        shadow-sm
      ">





        <Link

          href="/"

          className="
            text-3xl
            md:text-4xl
            font-black
            tracking-tight
          "

        >

          RANKD

        </Link>









        <div className="
          hidden
          md:flex
          items-center
          gap-8
          font-black
        ">



          <Link

            href="/explore"

            className="
              hover:opacity-60
              transition
            "

          >

            Explore

          </Link>







          <Link

            href="/create"

            className="
              bg-black
              text-white
              px-7
              py-3
              rounded-full
              hover:-translate-y-1
              transition
            "

          >

            Create Top 7

          </Link>







          <Link

            href="/profile"

            className="
              hover:opacity-60
              transition
            "

          >

            Profile

          </Link>





        </div>









        <div className="
          flex
          md:hidden
          items-center
          gap-3
        ">


          <Link

            href="/explore"

            className="
              font-black
              text-sm
            "

          >

            Explore

          </Link>





          <Link

            href="/create"

            className="
              bg-black
              text-white
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              font-black
              text-xl
            "

          >

            +

          </Link>


        </div>






      </div>


    </nav>

  )

}