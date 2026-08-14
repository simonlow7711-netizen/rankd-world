import Link from "next/link"


export default function Navbar() {


  return (

    <nav
      className="
        sticky
        top-0
        z-50
        w-full
        px-4
        md:px-8
        py-4
        bg-[#F7F4EE]/90
        backdrop-blur-md
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          bg-white
          rounded-full
          px-5
          md:px-7
          py-3
          shadow-sm
          flex
          items-center
          justify-between
          gap-6
        "
      >

        <Link
          href="/"
          className="
            flex
            flex-col
            shrink-0
            leading-none
          "
        >

          <span
            className="
              text-2xl
              md:text-3xl
              font-black
              tracking-tight
            "
          >

            RANKD

          </span>


          <span
            className="
              mt-1
              text-[9px]
              md:text-[10px]
              font-bold
              tracking-tight
              text-black/50
              whitespace-nowrap
            "
          >

            The world's Top 7 everything.

          </span>

        </Link>


        <div
          className="
            hidden
            md:flex
            items-center
            gap-7
            font-bold
          "
        >

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
              hover:opacity-60
              transition
            "
          >

            Create

          </Link>


          <Link
            href="/categories"
            className="
              hover:opacity-60
              transition
            "
          >

            Categories

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


        <div
          className="
            md:hidden
            flex
            items-center
            gap-3
          "
        >

          <Link
            href="/explore"
            className="
              text-sm
              font-bold
            "
          >

            Explore

          </Link>


          <Link
            href="/categories"
            className="
              text-sm
              font-bold
            "
          >

            Categories

          </Link>


          <Link
            href="/create"
            className="
              w-10
              h-10
              rounded-full
              bg-black
              text-white
              flex
              items-center
              justify-center
              text-xl
              font-black
            "
            aria-label="Create a RANKD"
          >

            +

          </Link>

        </div>

      </div>

    </nav>

  )

}