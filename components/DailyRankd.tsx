import Link from "next/link"
import { dailyRankd } from "@/data/dailyRankd"


export default function DailyRankd() {


  return (

    <section className="
      bg-white
      text-black
      rounded-3xl
      p-8
      mb-16
    ">


      <div className="
        flex
        items-center
        gap-3
        mb-4
      ">

        <span className="text-3xl">
          🏆
        </span>


        <p className="
          font-black
          text-xl
        ">
          RANKD OF THE DAY
        </p>

      </div>




      <h2 className="
        text-4xl
        font-black
      ">

        {dailyRankd.title}

      </h2>





      <p className="
        mt-4
        text-gray-600
        text-lg
      ">

        {dailyRankd.prompt}

      </p>





      <Link

        href={`/create?title=${encodeURIComponent(
          dailyRankd.title
        )}`}

      >

        <button

          className="
            mt-8
            bg-black
            text-white
            px-8
            py-4
            rounded-full
            font-black
          "

        >

          Create Your RANKD →

        </button>


      </Link>



    </section>

  )

}