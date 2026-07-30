import Link from "next/link"



export default function TasteMatchCard({

  person,

  match

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





        <p

          className="
            text-green-600
            font-black
          "

        >

          🧬 Taste Match

        </p>







        <h3

          className="
            text-2xl
            font-black
            mt-3
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
            text-5xl
            font-black
          "

        >

          {match.score}%

        </div>







        <p

          className="
            mt-4
            text-gray-600
          "

        >

          Shared:

          {" "}

          {match.sharedCategories.length > 0

            ? match.sharedCategories.join(", ")

            : "None yet"

          }


        </p>





      </div>



    </Link>


  )


}