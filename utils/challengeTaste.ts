export function calculateChallenge(

  userRankings:any[] = [],

  otherRankings:any[] = []

){



  const safeUserRankings =

    userRankings ?? []



  const safeOtherRankings =

    otherRankings ?? []







  if(

    safeUserRankings.length === 0

    ||

    safeOtherRankings.length === 0

  ){

    return {

      score:0,

      title:"No challenge yet",

      message:

        "Create more RANKDs to discover your differences."

    }

  }








  let comparisons = 0

  let differences = 0







  safeUserRankings.forEach(

    (userRanking)=>{


      safeOtherRankings.forEach(

        (otherRanking)=>{



          if(

            userRanking.category ===

            otherRanking.category

          ){



            comparisons++







            const userItems =

              userRanking.items

              ?.map(

                (item:any)=>

                  item.name

              )

              ??

              []








            const otherItems =

              otherRanking.items

              ?.map(

                (item:any)=>

                  item.name

              )

              ??

              []








            const overlap =

              userItems.filter(

                (item:string)=>

                  otherItems.includes(item)

              )








            if(

              overlap.length <

              userItems.length / 2

            ){

              differences++

            }



          }



        }

      )



    }

  )









  if(comparisons === 0){


    return {

      score:0,

      title:"No challenge yet",

      message:

        "No comparable rankings found."

    }


  }









  const score =

    Math.round(

      (

        differences /

        comparisons

      )

      *

      100

    )









  return {


    score,



    title:

      score >= 70

      ?

      "High debate potential 🔥"

      :

      score >= 40

      ?

      "Interesting differences"

      :

      "Similar opinions",




    message:

      score >= 70

      ?

      "Your ranking could spark a real debate."

      :

      "See where your opinions differ."



  }


}