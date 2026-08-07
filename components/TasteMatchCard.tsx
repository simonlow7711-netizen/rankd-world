"use client"





type Props = {

  person:any

  rankings:any[]

}









type Difference = {

  type:string

  value:number

}









export default function TasteMatchCard({

  person,

  rankings

}:Props){





  const graphScore =

    person?.tasteMatch?.score ?? 0







  const match = {


    score:

      graphScore,





    label:

      graphScore >= 80

      ?

      "You think very similarly."

      :

      graphScore >= 60

      ?

      "You share strong taste patterns."

      :

      "You have some overlapping preferences.",





    explanation:

      graphScore >= 80

      ?

      "Your rankings show very similar choices and judgement patterns."

      :

      graphScore >= 60

      ?

      "Your Taste Graph signals show meaningful overlap."

      :

      "Your opinions connect through shared rankings.",





    sharedCategories:

      person?.tasteDNA

      ?

      Object.keys(

        person.tasteDNA.categories ?? {}

      )

      :

      [],





    breakdown:{


      categoryScore:

        Math.min(

          graphScore,

          100

        ),



      choiceScore:

        Math.min(

          graphScore,

          100

        ),



      behaviourScore:

        Math.min(

          graphScore,

          100

        )


    },





    differences:

      [] as Difference[]



  }









  return (

    <div className="
      rankd-card
      p-8
    ">





      <div className="
        flex
        items-center
        justify-between
        gap-4
      ">





        <div>


          <p className="
            rankd-accent
            uppercase
            tracking-widest
            text-sm
            font-black
          ">

            Taste Match

          </p>






          <h3 className="
            text-3xl
            font-black
            mt-3
          ">

            {person?.displayName ?? "RANKD User"}

          </h3>






          <p className="
            rankd-muted
            mt-2
          ">

            @{person?.username ?? "anonymous"}

          </p>



        </div>








        <div className="
          w-24
          h-24
          rounded-full
          bg-black
          text-white
          flex
          items-center
          justify-center
          text-3xl
          font-black
          shrink-0
        ">


          {match.score}%


        </div>



      </div>









      <div className="
        mt-8
      ">



        <p className="
          text-xl
          font-black
        ">

          {match.label}

        </p>






        <p className="
          mt-3
          rankd-muted
        ">

          {match.explanation}

        </p>



      </div>
            {match.sharedCategories.length > 0 && (


        <div className="
          mt-8
          pt-6
          border-t
          border-black/10
        ">



          <p className="
            font-black
            mb-3
          ">

            Shared taste areas

          </p>







          <div className="
            flex
            flex-wrap
            gap-2
          ">



            {match.sharedCategories

              .slice(0,5)

              .map(category=>(


                <span

                  key={category}

                  className="
                    bg-[#F7F4EE]
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-bold
                  "

                >

                  {category}

                </span>


              ))}



          </div>



        </div>


      )}









      <div className="
        mt-8
        pt-6
        border-t
        border-black/10
      ">




        <p className="
          font-black
          mb-4
        ">

          Taste breakdown

        </p>







        <div className="
          grid
          grid-cols-3
          gap-3
        ">




          <div className="
            bg-black
            text-white
            rounded-2xl
            p-4
            text-center
          ">

            <p className="
              text-xs
              opacity-60
            ">

              Categories

            </p>


            <p className="
              text-xl
              font-black
            ">

              {match.breakdown.categoryScore}%

            </p>


          </div>







          <div className="
            bg-black
            text-white
            rounded-2xl
            p-4
            text-center
          ">

            <p className="
              text-xs
              opacity-60
            ">

              Choices

            </p>


            <p className="
              text-xl
              font-black
            ">

              {match.breakdown.choiceScore}%

            </p>


          </div>








          <div className="
            bg-black
            text-white
            rounded-2xl
            p-4
            text-center
          ">

            <p className="
              text-xs
              opacity-60
            ">

              Style

            </p>


            <p className="
              text-xl
              font-black
            ">

              {match.breakdown.behaviourScore}%

            </p>


          </div>





        </div>


      </div>









      {match.differences.length > 0 && (


        <div className="
          mt-8
          pt-6
          border-t
          border-black/10
        ">



          <p className="
            font-black
            mb-3
          ">

            Perspective differences

          </p>





          <div className="
            space-y-2
          ">



            {match.differences

              .slice(0,3)

              .map((difference,index)=>(


                <div

                  key={`${difference.type}-${index}`}

                  className="
                    flex
                    justify-between
                    text-sm
                    font-bold
                  "

                >


                  <span>

                    {difference.type}

                  </span>




                  <span>

                    {difference.value}% difference

                  </span>



                </div>


              ))}



          </div>



        </div>


      )}







    </div>

  )

}