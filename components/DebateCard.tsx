import Link from "next/link"



export default function DebateCard({

  debate,

  rankingId

}:any) {


  if(!debate){

    return null

  }




  return (

    <div className="
      bg-zinc-900
      rounded-3xl
      p-8
      text-white
    ">


      <p className="
        text-orange-400
        font-black
        text-xl
      ">

        🔥 BIGGEST DEBATE

      </p>





      <h3 className="
        text-3xl
        font-black
        mt-4
      ">

        {debate.item}

      </h3>






      <p className="
        mt-4
        text-gray-400
      ">

        This is where opinions differ most.

      </p>







      <div className="
        mt-6
        bg-black
        rounded-2xl
        p-5
      ">


        <p className="font-bold">

          Community:

          <span className="ml-2">

            #{debate.originalPosition}

          </span>

        </p>





        <p className="font-bold mt-2">

          Your ranking:

          <span className="ml-2">

            #{debate.newPosition}

          </span>

        </p>





        <p className="
          mt-4
          text-orange-400
          font-black
        ">

          Moved {debate.difference} places

        </p>



      </div>







      <Link

        href={`/create?remix=${rankingId}`}

      >

        <button

          className="
            mt-8
            bg-white
            text-black
            px-8
            py-4
            rounded-full
            font-black
          "

        >

          Create Your Own Top 7 →

        </button>


      </Link>





    </div>

  )

}