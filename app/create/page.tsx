"use client"

import {useState} from "react"


export default function Create(){


const [title,setTitle] = useState("")


const [items,setItems] = useState([
"",
"",
"",
"",
"",
"",
""
])


return (

<main className="
min-h-screen
bg-black
text-white
p-8
">


<div className="
max-w-2xl
mx-auto
">


<h1 className="
text-5xl
font-black
">
Create Your RANKD
</h1>


<p className="
mt-4
text-gray-400
">
What is your Top 7?
</p>


<input

className="
mt-8
w-full
p-4
rounded-xl
text-black
"

placeholder="
Top 7 of what?
"

value={title}

onChange={(e)=>setTitle(e.target.value)}

/>


<div className="
mt-8
space-y-3
">


{
items.map((item,index)=>(

<input

key={index}

className="
w-full
p-4
rounded-xl
text-black
"

placeholder={`#${index+1}`}

value={item}

onChange={(e)=>{

const copy=[...items]

copy[index]=e.target.value

setItems(copy)

}}

/>

))
}


</div>


<button

className="
mt-10
bg-white
text-black
px-8
py-4
rounded-full
font-black
"

>

Publish RANKD

</button>


</div>


</main>

)

}