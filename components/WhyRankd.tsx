import Link from "next/link"


const reasons = [

  {
    title: "Discover better recommendations",
    text: "Find what people think is genuinely worth your time.",
    link: "/explore",
    action: "Explore RANKDs →"
  },

  {
    title: "Create your own Top 7",
    text: "Rank anything. Share your opinion with the world.",
    link: "/create",
    action: "Create RANKD →"
  },

  {
    title: "Debate and compare",
    text: "Every ranking starts a conversation.",
    link: "/explore",
    action: "Join the debate →"
  },

]



export default function WhyRankd() {


  return (

    <section className="
      bg-black
      text-white
      px-6
      py-20
    ">


      <h2 className="
        text-4xl
        font-black
        mb-10
      ">

        Why RANKD?

      </h2>





      <div className="
        grid
        md:grid-cols-3
        gap-6
      ">



        {reasons.map((reason)=>(


          <Link

            key={reason.title}

            href={reason.link}

          >


            <div

              className="
                bg-zinc-900
                rounded-3xl
                p-8
                hover:scale-105
                transition
                cursor-pointer
              "

            >


              <h3 className="
                text-2xl
                font-bold
                mb-4
              ">

                {reason.title}

              </h3>





              <p className="
                text-gray-400
              ">

                {reason.text}

              </p>






              <p className="
                mt-6
                font-black
              ">

                {reason.action}

              </p>




            </div>


          </Link>


        ))}


      </div>


    </section>

  )

}