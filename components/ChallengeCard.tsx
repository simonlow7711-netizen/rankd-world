import Link from "next/link"



export default function ChallengeCard({

  person,

  ranking,

  challenge

}:{

  person:any

  ranking:any

  challenge:any

}) {


  return (

    <Link

      href={`/rank/${ranking.id}`}

    >


      <div className="
        rankd-card
        p-8
        h-full
        hover:-translate-y-2
        transition
      ">





        <p className="
          rankd-accent
          uppercase
          tracking-widest
          text-sm
          font-black
        ">

          Taste Challenge

        </p>







        <h3 className="
          text-3xl
          font-black
          mt-5
          leading-tight
        ">

          {ranking.title}

        </h3>







        <p className="
          mt-6
          text-lg
          rankd-muted
        ">

          {person.username} ranked this differently.

        </p>







        <div className="
          mt-8
          bg-[#F7F4EE]
          rounded-3xl
          p-6
        ">



          <p className="
            text-2xl
            font-black
          ">

            👀

            Someone disagrees.

          </p>





          <p className="
            mt-3
            rankd-muted
          ">

            Would you rank it differently?

          </p>



        </div>







        <p className="
          mt-8
          font-black
        ">

          View their RANKD →

        </p>





      </div>


    </Link>


  )

}