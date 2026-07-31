import Link from "next/link"


export default function RankingCard({

  ranking

}: any) {



  const isCommunity =
    ranking.source === "community"



  const opinionCount =
    ranking.remixes || 0



  const hasDebate =
    ranking.remixedFrom ||
    opinionCount > 0



  const creatorUsername =
    ranking.creatorUsername ||
    ranking.creatorId ||
    null



  const creatorName =
    ranking.creatorDisplayName ||
    ranking.creator ||
    "RANKD Community"





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
        cursor-pointer
      ">




        <div className="
          flex
          justify-between
          items-center
          mb-4
        ">


          <p className="
            text-sm
            text-gray-500
          ">

            #{ranking.category}

          </p>




          <span

            className={`
              text-xs
              font-bold
              px-3
              py-1
              rounded-full

              ${
                isCommunity
                ? "bg-purple-100 text-purple-700"
                : "bg-green-100 text-green-700"
              }
            `}

          >

            {isCommunity
              ? "COMMUNITY"
              : "OFFICIAL"
            }


          </span>



        </div>








        <h2 className="
          text-2xl
          font-black
        ">

          {ranking.title}

        </h2>






        <p className="
          mt-3
          text-gray-600
        ">


          by


          <span className="
            ml-1
            font-bold
          ">

            {creatorUsername
              ? `@${creatorUsername}`
              : creatorName
            }


          </span>


        </p>









        <div className="
          mt-5
          space-y-2
        ">


          {ranking.items

            .slice(0,3)

            .map((item:any)=>(


              <div

                key={item.position}

                className="
                  font-semibold
                "

              >

                #{item.position} {item.name}

              </div>


            ))}


        </div>








        <div className="
          mt-6
          border-t
          pt-4
          flex
          justify-between
          items-center
        ">




          <span className="
            text-sm
            font-bold
            text-gray-600
          ">


            {opinionCount === 0

              ? "Be the first to remix"

              : `${opinionCount} opinions created`

            }


          </span>







          {hasDebate && (

            <span className="
              text-xs
              font-black
              bg-black
              text-white
              px-3
              py-1
              rounded-full
            ">


              ⚡ DEBATE


            </span>


          )}




        </div>









        <div className="
          mt-5
          text-center
          bg-black
          text-white
          rounded-full
          py-3
          font-black
        ">


          RANKD IT →


        </div>





      </div>



    </Link>


  )

}