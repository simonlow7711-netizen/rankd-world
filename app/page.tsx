export default function Home() {

  return (

    <main className="
      bg-black
      text-white
      min-h-screen
      flex
      flex-col
      justify-center
      items-center
      text-center
      px-6
    ">

      <h1 className="
        text-[120px]
        font-black
      ">
        RANKD
      </h1>


      <h2 className="
        text-4xl
        font-bold
      ">
        The world's Top 7 everything.
      </h2>


      <p className="
        text-gray-400
        mt-6
        max-w-xl
      ">
        Everyone has an opinion.
        Now everyone can rank it.
      </p>


      <button className="
        mt-10
        bg-white
        text-black
        px-8
        py-4
        rounded-full
        font-bold
      ">
        Create Your Top 7
      </button>


    </main>

  )

}