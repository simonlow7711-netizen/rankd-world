import Link from "next/link"


const categories = [

  {
    name:"Food & Drink",
    slug:"food-drink",
    emoji:"🍕"
  },

  {
    name:"Film & TV",
    slug:"film-tv",
    emoji:"🎬"
  },

  {
    name:"Music",
    slug:"music",
    emoji:"🎵"
  },

  {
    name:"Sport",
    slug:"sport",
    emoji:"⚽"
  },

  {
    name:"Travel",
    slug:"travel",
    emoji:"🌍"
  },

  {
    name:"Gaming",
    slug:"gaming",
    emoji:"🎮"
  },

  {
    name:"Technology",
    slug:"technology",
    emoji:"💡"
  },

  {
    name:"Lifestyle",
    slug:"lifestyle",
    emoji:"✨"
  }

]



export default function Categories(){


return (

<section className="
bg-[#F7F4EE]
text-black
rounded-3xl
p-8
">


<h2 className="
text-4xl
font-black
mb-8
">

Browse Categories

</h2>




<div className="
grid
grid-cols-2
md:grid-cols-4
gap-5
">


{categories.map(category=>(


<Link

key={category.slug}

href={`/category/${category.slug}`}

className="
bg-white
rounded-3xl
p-6
font-black
hover:-translate-y-1
transition
"

>


<div className="
text-4xl
">

{category.emoji}

</div>



<h3 className="
mt-4
text-xl
">

{category.name}

</h3>


<p className="
mt-2
text-sm
text-gray-500
">

Explore Top 7s →

</p>



</Link>


))}


</div>


</section>

)

}