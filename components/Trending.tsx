import Link from "next/link"


const rankings = [

  {
    id: "best-burgers-london",
    title: "Top 7 Burgers in London",
    category: "Food",
  },

  {
    id: "best-nolan-films",
    title: "Top 7 Christopher Nolan Films",
    category: "Movies",
  },

  {
    id: "top-7-premier-league-kits",
    title: "Top 7 Premier League Kits",
    category: "Sport",
  },

  {
    id: "best-games-ever",
    title: "Top 7 Games of All Time",
    category: "Gaming",
  },

]



export default function Trending() {


  return (

    <section className="
      bg-black
      text-white
      px-6
      py-20
    ">


      <h2 className="
        text-4xl
        font-black
        mb-10
      ">

        🔥 Trending Today

      </h2>





      <div className="
        grid
        md:grid-cols-2
        gap-6
      ">


        {rankings.map((ranking)=>(


          <Link

            key={ranking.id}

            href={`/rank/${ranking.id}`}

          >


            <div

              className="
                bg-zinc-900
                rounded-3xl
                p-8
                hover:scale-105
                transition
                cursor-pointer
              "

            >


              <p className="
                text-gray-400
                mb-3
              ">

                {ranking.category}

              </p>





              <h3 className="
                text-2xl
                font-bold
              ">

                {ranking.title}

              </h3>






              <button className="
                mt-6
                text-sm
                font-bold
              ">

                View Ranking →

              </button>





            </div>


          </Link>


        ))}


      </div>


    </section>

  )

}