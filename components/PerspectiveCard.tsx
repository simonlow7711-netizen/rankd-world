import Link from "next/link"



export default function PerspectiveCard({

  ranking,

  gap

}:{

  ranking:any

  gap:number

}) {



  return (

    <Link

      href={`/rank/${ranking.id}`}

    >


      <div className="
        rankd-card
        p-8
        hover:-translate-y-2
        transition
        h-full
      ">





        <p className="
          rankd-accent
          uppercase
          tracking-widest
          text-sm
          font-black
        ">

          Perspective Gap

        </p>







        <h3 className="
          text-3xl
          font-black
          mt-5
          leading-tight
        ">

          {ranking.title}

        </h3>







        <div className="
          mt-8
          bg-[#F7F4EE]
          rounded-3xl
          p-6
        ">


          <p className="
            text-5xl
            font-black
          ">

            {gap}%

          </p>




          <p className="
            mt-2
            rankd-muted
          ">

            difference in opinion

          </p>


        </div>







        <p className="
          mt-8
          font-black
        ">

          See where people disagree →

        </p>




      </div>


    </Link>


  )

}