import Link from "next/link"



export default function DailyRankd(){


  return (

    <section className="
      px-6
      py-16
    ">


      <div className="
        max-w-6xl
        mx-auto
      ">



        <div className="
          rankd-card
          p-8
          md:p-14
          text-center
        ">



          <div className="
            max-w-3xl
            mx-auto
          ">


            <p className="
              rankd-accent
              uppercase
              tracking-[0.3em]
              text-sm
              font-black
            ">

              RANKD of the Day

            </p>





            <h2 className="
              text-4xl
              md:text-6xl
              font-black
              mt-5
              leading-tight
            ">

              Top 7 films everyone should watch?

            </h2>





            <p className="
              mt-6
              text-lg
              md:text-xl
              rankd-muted
              leading-relaxed
            ">

              Thousands of possible answers.
              <br />

              One question.

              <br />

              <span className="
                font-black
                text-black
              ">

                How would you rank it?

              </span>

            </p>





            <Link

              href="/create"

              className="
                inline-block
                mt-8
                rankd-button
              "

            >

              Create your ranking →

            </Link>



          </div>


        </div>


      </div>


    </section>

  )

}