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
        rankd-edition
        mb-12
        rounded-[28px]
        border
        border-black
        bg-[#F7F4EE]
        p-8
        text-center
        text-black
      "
    >


      <h2
        className="
          text-3xl
          font-black
          tracking-[-0.04em]
        "
      >
        Achievements
      </h2>





      <div
        className="
          mt-6
          grid
          gap-4
          md:grid-cols-2
        "
      >

        {achievements.map((achievement:any)=>(
          

          <div

            key={achievement.title}

            className="
              rounded-2xl
              border
              border-black
              bg-[#F7F4EE]
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
                mt-2
                text-black/50
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
