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
      rankd-edition
      rounded-[28px]
      border
      border-black
      bg-[#F7F4EE]
      p-8
      text-center
      text-black
    ">


      <p className="
        text-[11px]
        font-black
        uppercase
        tracking-[0.22em]
        text-[#FF6B35]
      ">

        Biggest debate

      </p>





      <h3 className="
        mt-4
        text-3xl
        font-black
        tracking-[-0.04em]
      ">

        {debate.item}

      </h3>






      <p className="
        mx-auto
        mt-4
        max-w-md
        text-black/50
      ">

        This is where opinions differ most.

      </p>






      <div className="
        mx-auto
        mt-6
        max-w-md
        rounded-2xl
        border
        border-black
        bg-[#F7F4EE]
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
          font-black
          text-[#FF6B35]
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
            rounded-full
            border
            border-black
            bg-black
            px-8
            py-4
            font-black
            text-white
            transition
            hover:bg-[#FF6B35]
            hover:text-black
          "

        >

          Create Your Own Top 7 →

        </button>


      </Link>





    </div>

  )

}
