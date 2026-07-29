import {rankings} from "@/data/rankings"
import RankingCard from "@/components/RankingCard"


export default function Explore(){

return (

<main className="
bg-gray-100
min-h-screen
p-8
">


<h1 className="
text-5xl
font-black
mb-10
">
Trending RANKDs
</h1>


<div className="
grid
md:grid-cols-3
gap-8
">


{
rankings.map((ranking)=>(

<RankingCard
key={ranking.id}
ranking={ranking}
/>

))
}


</div>


</main>

)

}