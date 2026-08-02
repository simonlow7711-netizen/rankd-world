import Link from "next/link"



const categories = [

  {
    name:"Food & Drink",
    emoji:"🍔",
    description:"The things worth tasting."
  },

  {
    name:"Film & TV",
    emoji:"🎬",
    description:"The stories everyone debates."
  },

  {
    name:"Music",
    emoji:"🎵",
    description:"Songs, artists and moments."
  },

  {
    name:"Sport",
    emoji:"⚽",
    description:"Players, teams and legends."
  },

  {
    name:"Travel",
    emoji:"✈️",
    description:"Places worth discovering."
  },

  {
    name:"Technology",
    emoji:"💡",
    description:"The ideas shaping tomorrow."
  },

  {
    name:"Lifestyle",
    emoji:"✨",
    description:"How people choose to live."
  },

  {
    name:"Entertainment",
    emoji:"🔥",
    description:"Culture everyone talks about."
  }

]







export default function Categories(){



  return (

    <section className="
      py-20
    ">


      <div className="
        max-w-6xl
        mx-auto
      ">





        <div className="
          mb-10
        ">


          <p className="
            rankd-accent
            uppercase
            tracking-[0.3em]
            text-sm
            font-black
          ">

            Discover

          </p>




          <h2 className="
            text-4xl
            md:text-5xl
            font-black
            mt-3
          ">

            Browse Categories

          </h2>




          <p className="
            mt-4
            text-gray-500
            max-w-xl
          ">

            Explore what people are ranking
            and discover where your opinions differ.

          </p>


        </div>









        <div className="
          grid
          md:grid-cols-4
          gap-6
        ">





          {categories.map(category=>(


            <Link

              key={category.name}

              href={`/explore?category=${encodeURIComponent(category.name)}`}

            >


              <div className="
                rankd-card
                p-6
                h-full
                hover:-translate-y-1
                transition
              ">


                <div className="
                  text-4xl
                ">

                  {category.emoji}

                </div>




                <h3 className="
                  text-2xl
                  font-black
                  mt-5
                ">

                  {category.name}

                </h3>





                <p className="
                  mt-3
                  text-gray-500
                ">

                  {category.description}

                </p>





                <p className="
                  mt-6
                  font-black
                  text-orange-500
                ">

                  Explore →

                </p>


              </div>


            </Link>


          ))}


        </div>







      </div>


    </section>

  )

}