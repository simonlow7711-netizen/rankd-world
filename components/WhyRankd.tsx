import Link from "next/link"



const steps = [

  {

    number:"01",

    title:"Choose a topic",

    text:
      "Pick anything. Films, food, travel, sport, music or your own idea.",

    link:"/explore",

    action:"Find a topic →"

  },


  {

    number:"02",

    title:"Rank your Top 7",

    text:
      "Put your choices in order. Your #1 says something about you.",

    link:"/create",

    action:"Create your RANKD →"

  },


  {

    number:"03",

    title:"Compare perspectives",

    text:
      "See where people agree, disagree and create different rankings.",

    link:"/explore",

    action:"Explore debates →"

  }

]





export default function WhyRankd(){


  return (

    <section className="
      bg-[#F7F4EE]
      px-6
      py-24
    ">


      <div className="
        max-w-7xl
        mx-auto
      ">





        <div className="
          max-w-3xl
        ">


          <p className="
            rankd-accent
            uppercase
            tracking-[0.3em]
            text-sm
            font-black
          ">

            How RANKD works

          </p>





          <h2 className="
            text-5xl
            md:text-6xl
            font-black
            mt-5
            leading-tight
          ">

            Every opinion has a ranking.

          </h2>





          <p className="
            mt-6
            text-xl
            rankd-muted
          ">

            Create your Top 7.
            See how your perspective compares with the world.

          </p>


        </div>









        <div className="
          grid
          md:grid-cols-3
          gap-6
          mt-14
        ">





          {steps.map(step=>(


            <Link

              key={step.number}

              href={step.link}

            >



              <div className="
                bg-white
                rounded-3xl
                p-8
                h-full
                border
                border-black/5
                hover:-translate-y-2
                transition
              ">



                <p className="
                  text-5xl
                  font-black
                  text-orange-500
                ">

                  {step.number}

                </p>






                <h3 className="
                  text-3xl
                  font-black
                  mt-8
                ">

                  {step.title}

                </h3>






                <p className="
                  mt-5
                  text-gray-600
                  leading-relaxed
                ">

                  {step.text}

                </p>






                <p className="
                  mt-8
                  font-black
                ">

                  {step.action}

                </p>





              </div>


            </Link>


          ))}


        </div>





      </div>


    </section>


  )

}