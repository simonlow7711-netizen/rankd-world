import Link from "next/link"


export default function Navbar(){

return (

<nav className="
w-full
flex
justify-between
items-center
px-8
py-6
bg-black
text-white
">


<Link
href="/"
className="
text-4xl
font-black
"
>
RANKD
</Link>


<div className="
flex
gap-8
font-semibold
">


<Link href="/explore">
Explore
</Link>


<Link href="/create">
Create
</Link>


<Link href="/profile">
Profile
</Link>


</div>


</nav>

)

}