import Link from "next/link"


export default function DiscoveryCard({
  ranking
}:any) {


  return (

    <Link href={`/rank/${ranking.id}`}>

      <div

        className="
          bg-white
          text-black
          rounded-3xl
          p-6
          hover:scale-105
          transition
        "

      >

        <p className="text-gray-500">

          #{ranking.category}

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
            mt-3
            text-gray-600
          "

        >

          {ranking.description}

        </p>


        <p

          className="
            mt-5
            font-bold
          "

        >

          Created by {ranking.creator}

        </p>


      </div>

    </Link>

  )

}