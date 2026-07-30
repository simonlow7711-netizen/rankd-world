import Link from "next/link"



export default function PerspectiveCard({

  ranking,

  gap

}:any) {


  return (

    <Link

      href={`/rank/${ranking.id}`}

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
            text-purple-600
            font-black
          "

        >

          🌍 Perspective Gap

        </p>






        <h3

          className="
            text-2xl
            font-black
            mt-3
          "

        >

          {ranking.title}

        </h3>







        <p

          className="
            mt-4
            text-gray-600
          "

        >

          Biggest disagreement:

        </p>






        <p

          className="
            mt-2
            font-black
          "

        >

          {gap.item}

        </p>







        <p

          className="
            mt-3
            text-gray-500
          "

        >

          Moved {gap.difference} places

        </p>






      </div>



    </Link>


  )

}