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
        Your Taste DNA
      </h2>




      <p
        className="
          mx-auto
          mt-3
          max-w-md
          text-black/50
        "
      >

        Your rankings reveal what you care about.

      </p>





      <div
        className="
          mx-auto
          mt-8
          max-w-xl
          space-y-5
          text-left
        "
      >


        {data.tasteDNA.map((item:any)=>(


          <div
            key={item.category}
          >


            <div
              className="
                mb-2
                flex
                justify-between
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
                  text-black/40
                "
              >
                {item.count}
              </span>


            </div>





            <div
              className="
                h-4
                overflow-hidden
                rounded-full
                border
                border-black/10
                bg-[#F7F4EE]
              "
            >

              <div

                className="
                  h-full
                  rounded-full
                  bg-[#FF6B35]
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
            mx-auto
            mt-10
            max-w-xl
            rounded-2xl
            border
            border-black
            bg-[#F7F4EE]
            p-5
          "
        >

          <p
            className="
              text-[10px]
              font-black
              uppercase
              tracking-[0.18em]
              text-black/40
            "
          >
            Your strongest taste:
          </p>


          <p
            className="
              mt-2
              text-3xl
              font-black
            "
          >
            {data.strongestCategory}
          </p>


        </div>

      )}



    </section>

  )

}
