import Link from "next/link"



export default function TasteMatchCard({

  person,

  match

}:{

  person:any

  match:{
    score:number
    sharedCategories:any[]
  }

}){



  return (

    <Link

      href={`/profile/${person.username}`}

    >

      <div className="
        rankd-card
        p-6
        hover:-translate-y-1
        transition
      ">


        <p className="
          text-sm
          uppercase
          tracking-widest
          rankd-muted
          font-black
        ">

          Taste Match

        </p>





        <h3 className="
          text-2xl
          font-black
          mt-4
        ">

          @{person.username}

        </h3>







        <div className="
          mt-6
          inline-flex
          items-center
          gap-2
          bg-black
          text-white
          rounded-full
          px-5
          py-3
        ">


          <span>
            🤝
          </span>


          <span className="
            font-black
          ">

            {match.score}% Match

          </span>


        </div>








        {match.sharedCategories?.length > 0 && (

          <div className="
            mt-5
          ">


            <p className="
              text-sm
              text-gray-500
              font-bold
            ">

              You both ranked:

            </p>




            <div className="
              flex
              flex-wrap
              gap-2
              mt-3
            ">


              {match.sharedCategories.map(

                (category:any)=>(

                  <span

                    key={category}

                    className="
                      bg-[#F7F4EE]
                      px-3
                      py-2
                      rounded-full
                      text-sm
                      font-bold
                    "

                  >

                    {category}

                  </span>

                )

              )}


            </div>


          </div>

        )}







      </div>

    </Link>

  )

}