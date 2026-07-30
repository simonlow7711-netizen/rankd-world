import Link from "next/link"


export default function PeopleCard({

  person

}:any){


  return (

    <Link

      href={`/profile/${person.username}`}

    >

      <div

        className="
          bg-white
          text-black
          rounded-3xl
          p-6
          hover:scale-105
          transition
          cursor-pointer
        "

      >


        <h3

          className="
            text-2xl
            font-black
          "

        >

          {person.displayName}

        </h3>



        <p

          className="
            text-gray-500
            mt-2
          "

        >

          @{person.username}

        </p>





        <div

          className="
            mt-6
            grid
            grid-cols-2
            gap-4
          "

        >



          <div

            className="
              bg-black
              text-white
              rounded-2xl
              p-4
            "

          >

            <p className="text-xs text-gray-400">

              RANKDs

            </p>


            <p className="text-2xl font-black">

              {person.rankings.length}

            </p>


          </div>





          <div

            className="
              bg-black
              text-white
              rounded-2xl
              p-4
            "

          >

            <p className="text-xs text-gray-400">

              Achievements

            </p>


            <p className="text-2xl font-black">

              {person.achievements.length}

            </p>


          </div>



        </div>





        <div

          className="
            mt-6
            bg-black
            text-white
            rounded-full
            px-5
            py-3
            text-center
            font-black
          "

        >

          View Profile →

        </div>



      </div>


    </Link>


  )

}