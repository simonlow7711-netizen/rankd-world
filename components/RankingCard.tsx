import Link from "next/link"


export default function RankingCard({
  ranking
}:any){

return (

<Link href={`/rank/${ranking.id}`}>

<div className="
bg-white
text-black
rounded-3xl
p-6
shadow-lg
hover:scale-105
transition
">

<p className="
text-sm
text-gray-500
">
#{ranking.category}
</p>


<h2 className="
text-2xl
font-black
mt-2
">
{ranking.title}
</h2>


<p className="
mt-3
text-gray-600
">
Created by {ranking.creator}
</p>


<div className="
mt-6
space-y-2
">

{ranking.items.slice(0,3).map((item:any)=>(

<div
key={item.name}
className="
font-semibold
"
>

#{item.position} {item.name}

</div>

))}

</div>


</div>

</Link>

)

}