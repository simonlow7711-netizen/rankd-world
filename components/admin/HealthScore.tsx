export default function HealthScore({

  score

}:{

  score:number

}) {


return (

<section className="
  bg-black
  text-white
  rounded-[40px]
  p-10
">


<p className="
 uppercase
 tracking-[0.3em]
 text-sm
 font-black
 text-orange-500
">

RANKD Health

</p>




<h2 className="
 text-8xl
 font-black
 mt-5
">

{score}%

</h2>




<p className="
 text-xl
 text-gray-300
 mt-5
 max-w-xl
">

Based on discovery, opinions created,
and community participation.

</p>



</section>

)


}