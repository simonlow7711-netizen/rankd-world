export default function Hero() {
  return (
    <section className="
      min-h-screen
      bg-black
      text-white
      flex
      flex-col
      justify-center
      items-center
      text-center
      px-6
    ">

      <h1 className="
        text-8xl
        md:text-[140px]
        font-black
        tracking-tight
      ">
        RANKD
      </h1>

      <h2 className="
        text-3xl
        md:text-5xl
        font-bold
        mt-6
      ">
        The world's Top 7 everything.
      </h2>

      <p className="
        text-gray-400
        max-w-xl
        mt-6
        text-lg
      ">
        Discover the best recommendations.
        Create your own rankings.
        Decide what deserves the top spot.
      </p>

      <div className="
        flex
        gap-4
        mt-10
        flex-col
        md:flex-row
      ">

        <button className="
          bg-white
          text-black
          px-8
          py-4
          rounded-full
          font-bold
        ">
          Explore Rankings
        </button>

        <button className="
          border
          border-white
          text-white
          px-8
          py-4
          rounded-full
          font-bold
        ">
          Create Your Top 7
        </button>

      </div>

    </section>
  )
}