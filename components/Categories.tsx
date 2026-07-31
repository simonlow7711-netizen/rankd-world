import Link from "next/link"


const categories = [

  {
    name: "Food",
    icon: "🍔"
  },

  {
    name: "Movies",
    icon: "🎬"
  },

  {
    name: "Music",
    icon: "🎵"
  },

  {
    name: "Sport",
    icon: "⚽"
  },

  {
    name: "Gaming",
    icon: "🎮"
  },

  {
    name: "Travel",
    icon: "✈️"
  },

  {
    name: "Books",
    icon: "📚"
  },

  {
    name: "Technology",
    icon: "💻"
  },

]



export default function Categories() {


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

        Browse Categories

      </h2>





      <div className="
        grid
        grid-cols-2
        md:grid-cols-4
        gap-5
      ">




        {categories.map((category)=>(


          <Link

            key={category.name}

            href={`/explore?category=${encodeURIComponent(
              category.name
            )}`}

          >


            <div

              className="
                bg-zinc-900
                rounded-3xl
                p-8
                text-xl
                font-bold
                hover:scale-105
                transition
                cursor-pointer
              "

            >

              {category.icon} {category.name}


            </div>


          </Link>


        ))}



      </div>


    </section>

  )

}