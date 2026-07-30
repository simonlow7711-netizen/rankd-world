"use client"

export default function ProfileCard({
  username,
  rankings,
  achievements
}:any){


  return (

    <div
      className="
        bg-white
        text-black
        rounded-3xl
        p-8
        mb-12
      "
    >


      <h2
        className="
          text-4xl
          font-black
        "
      >
        @{username}
      </h2>



      <p
        className="
          mt-3
          text-gray-600
        "
      >
        My RANKD identity
      </p>




      <div
        className="
          mt-8
          grid
          grid-cols-2
          gap-4
        "
      >


        <div
          className="
            bg-black
            text-white
            rounded-2xl
            p-5
          "
        >

          <p className="text-gray-400">
            RANKDs
          </p>


          <p
            className="
              text-3xl
              font-black
            "
          >
            {rankings.length}
          </p>


        </div>






        <div
          className="
            bg-black
            text-white
            rounded-2xl
            p-5
          "
        >

          <p className="text-gray-400">
            Achievements
          </p>


          <p
            className="
              text-3xl
              font-black
            "
          >
            {achievements.length}
          </p>


        </div>


      </div>




      <p
        className="
          mt-8
          font-bold
        "
      >

        Discover my Top 7 everything →

      </p>


    </div>

  )

}