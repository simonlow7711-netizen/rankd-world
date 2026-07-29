import { rankings } from "@/data/rankings"


export default async function RankPage({
  params
}: {
  params: Promise<{ id: string }>
}) {

const { id } = await params


const ranking = rankings.find(
  item => item.id === id
)


if(!ranking){

return (

<div className="
p-10
text-2xl
font-bold
">
Ranking not found
</div>

)

}


return (

<main className="
min-h-screen
bg-black
text-white
p-8
">


<div className="
max-w-3xl
mx-auto
">


<p className="
text-gray-400
">
#{ranking.category}
</p>


<h1 className="
text-5xl
font-black
mt-4
">
{ranking.title}
</h1>


<p className="
mt-4
text-gray-400
">
Created by {ranking.creator}
</p>



<div className="
mt-12
space-y-4
">


{
ranking.items.map(item=>(

<div
key={item.position}
className="
bg-white
text-black
rounded-2xl
p-5
flex
justify-between
items-center
"
>


<div>

<span className="
text-3xl
font-black
mr-4
">
#{item.position}
</span>


<span className="
text-xl
font-bold
">
{item.name}
</span>


</div>


<div className="
text-gray-500
">
{item.votes}
</div>


</div>

))
}


</div>


<button className="
mt-12
bg-white
text-black
rounded-full
px-10
py-4
font-black
text-lg
">

RANKD IT

</button>


</div>


</main>

)

}