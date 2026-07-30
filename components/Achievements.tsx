"use client"

export default function Achievements({
  achievements
}: any) {


  if (!achievements || achievements.length === 0) {

    return null

  }



  return (

    <section
      className="
        bg-zinc-900
        rounded-3xl
        p-8
        mb-12
      "
    >


      <h2
        className="
          text-3xl
          font-black
        "
      >
        🏆 Achievements
      </h2>





      <div
        className="
          mt-6
          grid
          md:grid-cols-2
          gap-4
        "
      >


        {achievements.map((achievement:any)=>(
          

          <div

            key={achievement.title}

            className="
              bg-black
              rounded-2xl
              p-5
            "

          >

            <h3
              className="
                text-xl
                font-black
              "
            >
              {achievement.title}
            </h3>


            <p
              className="
                text-gray-400
                mt-2
              "
            >
              {achievement.description}
            </p>


          </div>


        ))}


      </div>


    </section>

  )

}