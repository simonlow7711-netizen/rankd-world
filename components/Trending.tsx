import Link from "next/link"


const trending = [

  {
    title:"Greatest Films Ever",
    perspectives:"42 perspectives",
    category:"Film & TV"
  },

  {
    title:"Best Burgers London",
    perspectives:"27 perspectives",
    category:"Food & Drink"
  },

  {
    title:"Greatest Albums Ever",
    perspectives:"19 perspectives",
    category:"Music"
  }

]





export default function Trending(){


  return (

    <section className="
      bg-[#F7F4EE]
      px-6
      py-24
    ">


      <div className="
        max-w-7xl
        mx-auto
      ">




        <div className="
          flex
          justify-between
          items-end
          mb-12
        ">


          <div>


            <p className="
              rankd-accent
              uppercase
              tracking-[0.3em]
              text-sm
              font-black
            ">

              Community

            </p>





            <h2 className="
              text-5xl
              font-black
              mt-4
            ">

              🔥 Live Perspectives

            </h2>



          </div>







          <Link

            href="/explore"

            className="
              hidden
              md:block
              font-black
            "

          >

            View all →

          </Link>


        </div>









        <div className="
          grid
          md:grid-cols-3
          gap-6
        ">





          {trending.map(item=>(


            <Link

              key={item.title}

              href="/explore"

            >


              <div className="
                bg-white
                rounded-3xl
                p-8
                border
                border-black/5
                hover:-translate-y-2
                transition
              ">



                <p className="
                  text-sm
                  font-black
                  text-orange-500
                  uppercase
                ">

                  {item.category}

                </p>






                <h3 className="
                  text-3xl
                  font-black
                  mt-5
                ">

                  {item.title}

                </h3>







                <div className="
                  mt-8
                  inline-flex
                  bg-[#F7F4EE]
                  rounded-full
                  px-5
                  py-3
                  font-black
                ">

                  🔥 {item.perspectives}

                </div>







                <p className="
                  mt-8
                  font-black
                ">

                  See the debate →

                </p>



              </div>


            </Link>


          ))}



        </div>





      </div>


    </section>


  )

}