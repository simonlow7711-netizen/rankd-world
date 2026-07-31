import Link from "next/link"


export default function Footer() {

  return (

    <footer className="
      bg-black
      text-white
      border-t
      border-zinc-800
      px-6
      py-12
    ">


      <div className="
        max-w-6xl
        mx-auto
        flex
        flex-col
        md:flex-row
        justify-between
        gap-8
      ">



        <div>

          <Link href="/">

            <h2 className="
              text-3xl
              font-black
              cursor-pointer
            ">

              RANKD

            </h2>

          </Link>




          <p className="
            text-gray-400
            mt-3
          ">

            The world's Top 7 everything.

          </p>


        </div>







        <div className="
          flex
          gap-8
          text-gray-400
        ">


          <Link

            href="/explore"

            className="
              hover:text-white
              transition
            "

          >

            Explore

          </Link>





          <Link

            href="/create"

            className="
              hover:text-white
              transition
            "

          >

            Create

          </Link>





          <Link

            href="/"

            className="
              hover:text-white
              transition
            "

          >

            About

          </Link>




        </div>



      </div>





      <p className="
        text-gray-600
        text-sm
        mt-10
      ">

        © {new Date().getFullYear()} RANKD. All opinions welcome.

      </p>




    </footer>

  )

}