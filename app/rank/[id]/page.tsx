import { rankings } from "@/data/rankings"


export default async function RankPage({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const { id } = await params


  const ranking = rankings.find(
    item => item.id === id
  )


  if (!ranking) {

    return (

      <div className="
        p-10
        text-2xl
        font-bold
      ">
        Ranking not found
      </div>

    )

  }


  return (

    <main className="
      min-h-screen
      bg-black
      text-white
      px-6
      py-20
    ">


      <div className="
        max-w-3xl
        mx-auto
      ">


        <p className="
          text-gray-400
          uppercase
          tracking-wide
        ">
          {ranking.category}
        </p>


        <h1 className="
          text-5xl
          md:text-6xl
          font-black
          mt-4
        ">
          {ranking.title}
        </h1>


        <p className="
          mt-6
          text-gray-400
          text-lg
        ">
          {ranking.description}
        </p>


        <p className="
          mt-4
          text-gray-500
        ">
          Created by {ranking.creator}
        </p>



        <div className="
          mt-12
          space-y-4
        ">


        {ranking.items.map(item => (

          <div
            key={item.position}
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-3xl
              p-6
              flex
              justify-between
              items-center
            "
          >


            <div className="
              flex
              items-center
              gap-5
            ">


              <span className="
                text-3xl
                font-black
              ">
                {item.position === 1 && "🥇"}
                {item.position === 2 && "🥈"}
                {item.position === 3 && "🥉"}
                {item.position > 3 && item.position}
              </span>


              <span className="
                text-xl
                font-bold
              ">
                {item.name}
              </span>


            </div>


            <div className="
              text-gray-400
            ">
              {item.votes} votes
            </div>


          </div>

        ))}


        </div>


        <button className="
          mt-12
          bg-white
          text-black
          rounded-full
          px-10
          py-4
          font-black
          text-lg
        ">
          Create Your Top 7
        </button>


      </div>


    </main>

  )

}