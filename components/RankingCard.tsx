import Link from "next/link";


export default function RankingCard({
  ranking
}: any) {

  const totalVotes = ranking.items.reduce(
    (total:any, item:any) => total + item.votes,
    0
  );


  return (

    <Link href={`/rank/${ranking.id}`}>

      <div className="
        bg-zinc-900
        text-white
        rounded-3xl
        p-8
        border
        border-zinc-800
        hover:scale-105
        transition
        cursor-pointer
      ">


        <p className="
          text-sm
          text-gray-400
          uppercase
          tracking-wide
        ">
          {ranking.category}
        </p>


        <h2 className="
          text-3xl
          font-black
          mt-3
        ">
          {ranking.title}
        </h2>


        <p className="
          mt-4
          text-gray-400
        ">
          Created by {ranking.creator}
        </p>


        <div className="
          mt-6
          space-y-3
        ">

          {ranking.items.slice(0,3).map((item:any)=>(

            <div
              key={item.name}
              className="
                font-bold
                text-lg
              "
            >

              {item.position}. {item.name}

            </div>

          ))}


        </div>


        <div className="
          mt-8
          flex
          justify-between
          text-sm
          text-gray-400
        ">

          <span>
            7 items
          </span>

          <span>
            {totalVotes.toLocaleString()} votes
          </span>

        </div>


        <div className="
          mt-6
          font-bold
        ">
          View Ranking →
        </div>


      </div>

    </Link>

  );
}