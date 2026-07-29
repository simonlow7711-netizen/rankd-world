import { rankings } from "@/data/rankings";
import RankingCard from "@/components/RankingCard";

export default function Explore() {

  return (

    <main className="
      bg-black
      min-h-screen
      text-white
      px-6
      py-20
    ">

      <section className="
        max-w-6xl
        mx-auto
      ">

        <h1 className="
          text-5xl
          md:text-6xl
          font-black
          mb-4
        ">
          Explore RANKD
        </h1>


        <p className="
          text-gray-400
          text-lg
          mb-12
        ">
          Discover the world's Top 7 rankings.
        </p>


        <div className="
          grid
          md:grid-cols-3
          gap-8
        ">

          {rankings.map((ranking)=>(

            <RankingCard
              key={ranking.id}
              ranking={ranking}
            />

          ))}

        </div>

      </section>

    </main>

  );
}