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
          rankd-edition
          cursor-pointer
          rounded-[28px]
          border
          border-black
          bg-[#F7F4EE]
          p-6
          text-center
          text-black
          transition
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
            text-black/50
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
              rounded-2xl
              border
              border-black
              bg-[#F7F4EE]
              p-4
              text-black
            "

          >

            <p className="text-xs text-black/40">

              RANKDs

            </p>


            <p className="text-2xl font-black">

              {person.rankings.length}

            </p>


          </div>





          <div

            className="
              rounded-2xl
              border
              border-black
              bg-[#F7F4EE]
              p-4
              text-black
            "

          >

            <p className="text-xs text-black/40">

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
            rounded-full
            border
            border-black
            bg-black
            px-5
            py-3
            text-center
            font-black
            text-white
          "

        >

          View Profile →

        </div>



      </div>


    </Link>


  )

}