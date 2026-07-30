"use client"

export default function TasteDNA({
  data
}: any) {


  if (!data || data.tasteDNA.length === 0) {

    return null

  }




  const maxCount =
    data.tasteDNA[0].count





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
        Your Taste DNA
      </h2>




      <p
        className="
          mt-3
          text-gray-400
        "
      >

        Your rankings reveal what you care about.

      </p>






      <div
        className="
          mt-8
          space-y-5
        "
      >


        {data.tasteDNA.map((item:any)=>(


          <div
            key={item.category}
          >


            <div
              className="
                flex
                justify-between
                mb-2
              "
            >

              <span
                className="
                  font-bold
                "
              >
                {item.category}
              </span>


              <span
                className="
                  text-gray-400
                "
              >
                {item.count}
              </span>


            </div>





            <div
              className="
                h-4
                bg-black
                rounded-full
                overflow-hidden
              "
            >

              <div

                className="
                  h-full
                  bg-white
                  rounded-full
                "

                style={{
                  width:
                    `${(item.count / maxCount) * 100}%`
                }}

              />

            </div>


          </div>


        ))}



      </div>





      {data.strongestCategory && (

        <div
          className="
            mt-10
            bg-black
            rounded-2xl
            p-5
          "
        >

          <p
            className="
              text-gray-400
            "
          >
            Your strongest taste:
          </p>


          <p
            className="
              text-3xl
              font-black
              mt-2
            "
          >
            {data.strongestCategory}
          </p>


        </div>

      )}



    </section>

  )

}